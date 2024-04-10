import fs from 'fs'
import { Dropbox } from 'dropbox'
import { readAccessTokenFromFile, writeNewRefreshToken, writeNewAccessToken } from '../lib/tokenManager'
import { copyFilesToUploadFolder, createZip, emptyFilesToUploadFolder, emptyZipToUploadFolder } from '../lib/createZip'
import path from 'path'
import Config from '../lib/config'

const srcFolderArg = process.argv[2]
const dropBoxFolder = '/backups'

main()

async function main() {
    if (false) {
        // only run this once, then new auth code is needed
        await writeNewRefreshToken()
    }
    if (true) {
        // should be run every time to get a new access token
        await writeNewAccessToken()
    }
    if (true) {
        emptyFilesToUploadFolder()
        emptyZipToUploadFolder()
        copyFilesToUploadFolder(srcFolderArg)
        createZip()
    }

    for (let i = 0; i < 10; i++) {
        try {
            let truncateIsSucess = await truncateDropboxFolderToSize()
            let uploadIsSuccess = await uploadLatestBackupToDropbox()
            if (truncateIsSucess && uploadIsSuccess) {
                break
            }
        } catch (error) {
            console.log('Error uploading zip to Dropbox:', error)
            await new Promise((resolve) => setTimeout(resolve, 5000))
        }
    }
}

async function truncateDropboxFolderToSize() {
    const maxSizeInMB = 500
    const maxSize = maxSizeInMB * 1024 * 1024

    const accessToken = readAccessTokenFromFile()
    const dbx = new Dropbox({ accessToken: accessToken })

    // get total size
    const filesInFolder = await dbx.filesListFolder({ path: dropBoxFolder })
    // sort files in folder by date changed so that the newest files are first in list
    const filesInFolderSortedByDateChanged = filesInFolder.result.entries.sort(
        (a: any, b: any) => b.client_modified - a.client_modified,
    )
    const files = filesInFolderSortedByDateChanged
    const totalSize = files.reduce((acc, file: any) => acc + file.size, 0)
    console.log('Total size:', totalSize)
    console.log('Files:', files)

    if (totalSize < maxSize) {
        console.log('No need to truncate')
        return true
    }

    // delete oldest files until total size is below max size
    let deletedSize = 0
    const lengthOfFiles = files.length
    for (let i = lengthOfFiles - 1; i >= 0; i--) {
        const file: any = files[i]
        await dbx.filesDeleteV2({ path: file.path_display })
        deletedSize += file.size
        console.log('Deleted file:', file.path_display, file.size)
        if (totalSize - deletedSize < maxSize) {
            break
        }
    }
    return true
}

async function uploadLatestBackupToDropbox() {
    const accessToken = readAccessTokenFromFile()
    const dbx = new Dropbox({ accessToken: accessToken })

    const zipFile = getLatestFileInFolder(Config.getInstance().zipToUploadFolder)
    if (!zipFile) {
        throw new Error('No zip file found')
    }
    const fileContents = fs.readFileSync(zipFile)
    const destFileName = path.basename(zipFile)
    const destPath = `${dropBoxFolder}/${destFileName}`

    try {
        const response = await dbx.filesUpload({ path: destPath, contents: fileContents })

        if (response.status !== 200) {
            console.log('Error uploading file', response)
            return false
        }
        console.log('File uploaded successfully', zipFile, destPath)
        return true
    } catch (error: any) {
        console.error('Error uploading file:', error.message)
    }
}

async function listDropboxFiles() {
    const accessToken = readAccessTokenFromFile()
    const dbx = new Dropbox({ accessToken: accessToken })

    try {
        const response = await dbx.filesListFolder({ path: dropBoxFolder })

        if (response.status !== 200) {
            console.log('Error fetching files', response)
            return
        }

        console.log(JSON.stringify(response, null, 2))
    } catch (error: any) {
        console.error('Error fetching files:', error.message)
    }
}

function getLatestFileInFolder(folderPath: string): string | undefined {
    const files = fs.readdirSync(folderPath)

    if (files.length === 0) {
        return undefined
    }

    const sortedFiles = files.sort((a, b) => {
        return (
            fs.statSync(path.join(folderPath, b)).mtime.getTime() -
            fs.statSync(path.join(folderPath, a)).mtime.getTime()
        )
    })
    const newest = sortedFiles[0]
    return path.join(folderPath, newest)
}

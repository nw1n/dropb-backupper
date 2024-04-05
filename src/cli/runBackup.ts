import fs from 'fs'
import { Dropbox } from 'dropbox'
import { readAccessTokenFromFile, writeNewRefreshToken, writeNewAccessToken } from '../lib/tokenManager'
import { copyFilesToUploadFolder, createZip, emptyFilesToUploadFolder, emptyZipToUploadFolder } from '../lib/createZip'
import path from 'path'
import Config from '../lib/config'

const srcFolderArg = process.argv[2]

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
    //await listDropboxFiles()
    await uploadLatestBackupToDropbox()
}

async function uploadLatestBackupToDropbox() {
    const accessToken = readAccessTokenFromFile()
    const dbx = new Dropbox({ accessToken: accessToken })

    const zipFile = getLatestFileInFolder(Config.getInstance().zipToUploadFolder)
    const fileContents = fs.readFileSync(zipFile)
    const destFileName = path.basename(zipFile)
    const destPath = `/backups/${destFileName}`

    try {
        const response = await dbx.filesUpload({ path: destPath, contents: fileContents })

        if (response.status !== 200) {
            console.log('Error uploading file', response)
            return
        }

        console.log('File uploaded successfully', zipFile, destPath)
    } catch (error: any) {
        console.error('Error uploading file:', error.message)
    }
}

async function listDropboxFiles() {
    const accessToken = readAccessTokenFromFile()
    const dbx = new Dropbox({ accessToken: accessToken })

    try {
        const response = await dbx.filesListFolder({ path: '/backups' })

        if (response.status !== 200) {
            console.log('Error fetching files', response)
            return
        }

        console.log(JSON.stringify(response, null, 2))
    } catch (error: any) {
        console.error('Error fetching files:', error.message)
    }
}

function getLatestFileInFolder(folderPath: string) {
    const files = fs.readdirSync(folderPath)
    const sortedFiles = files.sort((a, b) => {
        return (
            fs.statSync(path.join(folderPath, b)).mtime.getTime() -
            fs.statSync(path.join(folderPath, a)).mtime.getTime()
        )
    })
    const newest = sortedFiles[0]
    return path.join(folderPath, newest)
}

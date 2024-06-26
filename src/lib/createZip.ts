import { exec } from 'child_process'
import Config from './config'
import fs from 'fs'
import path from 'path'

export function copyFilesToUploadFolder(srcFolderArg: string) {
    const srcFolder = srcFolderArg ? srcFolderArg : Config.getInstance().dummyUploadSourceFolder
    const destFolder = Config.getInstance().filesToUploadPathFolder

    if (!fs.existsSync(srcFolder)) {
        throw new Error(`Source folder does not exist: ${srcFolder}`)
    }
    if (!fs.existsSync(destFolder)) {
        throw new Error(`Destination folder does not exist: ${destFolder}`)
    }

    // Copy all files from the source folder to the destination folder
    exec(`cp -rf ${srcFolder}/* ${destFolder}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error copying files: ${error}`)
            return
        }
        if (stderr) {
            console.error(`Error: ${stderr}`)
            return
        }
        console.log(`Files copied successfully: ${stdout}`)
    })
}

function getDateTimeStringForFileName() {
    const date = new Date()
    const year = date.getFullYear()
    const month = padZero(date.getMonth() + 1)
    const day = padZero(date.getDate())
    const hours = padZero(date.getHours())
    const minutes = padZero(date.getMinutes())
    const seconds = padZero(date.getSeconds())
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

function padZero(value: number) {
    return value < 10 ? '0' + value : value
}

export function createZip() {
    const srcFolder = Config.getInstance().filesToUploadPathFolder
    const destFolder = Config.getInstance().zipToUploadFolder
    const destFile = `${getDateTimeStringForFileName()}_backup.zip`
    console.log(`Creating zip file: ${destFile}`)

    // Create a zip file from the source folder without including directory structure
    exec(`cd ${srcFolder} && zip -j ${destFolder}/${destFile} *`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating zip file: ${error}`)
            return
        }
        if (stderr) {
            console.error(`Error: ${stderr}`)
            return
        }
        console.log(`Zip file created successfully:`)
        console.log(stdout)
    })
}

export function emptyFilesToUploadFolder() {
    const folderPath = Config.getInstance().filesToUploadPathFolder

    try {
        const files = fs.readdirSync(folderPath)

        files.forEach((file) => {
            const filePath = path.join(folderPath, file)
            fs.unlinkSync(filePath)
            console.log('Deleted file:', filePath)
        })
    } catch (err) {
        console.error('Error deleting files:', err)
    }
}

export function emptyZipToUploadFolder() {
    const folderPath = Config.getInstance().zipToUploadFolder

    try {
        const files = fs.readdirSync(folderPath)

        files.forEach((file) => {
            const filePath = path.join(folderPath, file)
            fs.unlinkSync(filePath)
            console.log('Deleted file:', filePath)
        })
    } catch (err) {
        console.error('Error deleting files:', err)
    }
}

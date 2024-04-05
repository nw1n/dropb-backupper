import { exec } from 'child_process'
import Config from './config'
import fs from 'fs'
import path from 'path'

export function copyFilesToUploadFolder() {
    const srcFolder = Config.getInstance().dummyUploadSourceFolder
    const destFolder = Config.getInstance().filesToUploadPathFolder

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

export function createZip() {
    const srcFolder = Config.getInstance().filesToUploadPathFolder
    const destFolder = Config.getInstance().zipToUploadFolder
    const destFileName = 'files-to-upload.zip'

    // Create a zip file from the source folder
    exec(`zip -r ${destFolder}/${destFileName} ${srcFolder}`, (error, stdout, stderr) => {
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

import { exec } from 'child_process'
import Config from './config'
import e from 'express'

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

export function emptyFilesToUploadFolder() {
    const folder = Config.getInstance().filesToUploadPathFolder

    // Remove all files from the destination folder
    exec(`rm -rf ${folder}/*`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error removing files: ${error}`)
            return
        }
        if (stderr) {
            console.error(`Error: ${stderr}`)
            return
        }
        console.log(`Files removed successfully: ${stdout}`)
    })
}

export function emptyZipToUploadFolder() {
    const folder = Config.getInstance().zipToUploadFolder

    // Remove all files from the destination folder
    exec(`rm -rf ${folder}/*`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error removing files: ${error}`)
            return
        }
        if (stderr) {
            console.error(`Error: ${stderr}`)
            return
        }
        console.log(`Files removed successfully: ${stdout}`)
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
        console.log(`Zip file created successfully: ${stdout}`)
    })
}

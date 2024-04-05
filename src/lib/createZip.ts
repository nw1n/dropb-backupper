import { exec } from 'child_process'

export function createZip() {
    // Replace '/path/to/folder' with the path to the folder you want to zip
    const folderPath = '/path/to/folder'

    // Replace 'output.zip' with the desired name for the zip file
    const zipFileName = 'output.zip'

    // The zip command to execute
    const zipCommand = `zip -r ${zipFileName} ${folderPath}`

    // Execute the zip command
    exec(zipCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error zipping files: ${error}`)
            return
        }
        if (stderr) {
            console.error(`Error: ${stderr}`)
            return
        }
        console.log(`Files zipped successfully: ${stdout}`)
    })
}

import fs from 'fs'
import { Dropbox } from 'dropbox'
import { writeAccessTokenToFile, readAccessTokenFromFile, w } from '../lib/util'
let accessToken: string

main()

async function main() {
    if (true) {
        // only run this once, then new auth code is needed
        await writeNewRefreshToken()
    }
    if (true) {
        // should be run every time to get a new access token
        await writeNewAccessToken()
    }
    await doDropboxStuff()
}

async function doDropboxStuff() {
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

    try {
        console.log('Uploading file...')
    } catch (error: any) {
        console.error('Error uploading file:', error.message)
    }
}

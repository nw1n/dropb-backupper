import fs from 'fs'
import { Dropbox } from 'dropbox'
import { readAccessTokenFromFile, writeNewRefreshToken, writeNewAccessToken } from '../lib/util'

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
}

import Config from '../lib/config'
import fs from 'fs'

export async function writeNewAccessToken() {
    try {
        const refreshToken = readRefreshTokenFromFile()
        console.log(Config.getInstance().appKey)
        console.log(Config.getInstance().appSecret)
        const response = await fetch('https://api.dropbox.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                refresh_token: refreshToken as string,
                grant_type: 'refresh_token',
                client_id: Config.getInstance().appKey as string,
                client_secret: Config.getInstance().appSecret as string,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to fetch access token')
        }

        const data = await response.json()
        const accessToken = data.access_token
        writeAccessTokenToFile(accessToken)
        console.log('Success writing new access token', accessToken)
    } catch (error: any) {
        console.error('Error fetching access token:', error.message)
    }
}

export async function writeNewRefreshToken() {
    try {
        const response = await fetch('https://api.dropbox.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: Config.getInstance().authorizationCode as string,
                grant_type: 'authorization_code',
                client_id: Config.getInstance().appKey as string,
                client_secret: Config.getInstance().appSecret as string,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to obtain refresh token')
        }

        const data = await response.json()
        const refreshToken = data.refresh_token
        writeRefreshTokenToFile(refreshToken)
        console.log('Success writing new refresh token', refreshToken)
        return data.refresh_token
    } catch (error: any) {
        console.error('Error obtaining refresh token:', error.message)
        return null
    }
}

export function readRefreshTokenFromFile(): string | undefined {
    try {
        const data = fs.readFileSync(Config.getInstance().refreshTokenPath)
        return JSON.parse(data.toString()).refreshToken
    } catch (error: any) {
        console.error('Error reading refresh token from file:', error.message)
    }
}

export function writeRefreshTokenToFile(refreshToken: string) {
    fs.writeFileSync(Config.getInstance().refreshTokenPath, JSON.stringify({ refreshToken }))
}

export function readAccessTokenFromFile(): string | undefined {
    try {
        const data = fs.readFileSync(Config.getInstance().accessTokenPath)
        return JSON.parse(data.toString()).accessToken
    } catch (error: any) {
        console.error('Error reading access token from file:', error.message)
    }
}

export function writeAccessTokenToFile(accessToken: string) {
    fs.writeFileSync(Config.getInstance().accessTokenPath, JSON.stringify({ accessToken }))
}

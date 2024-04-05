import path from 'path'
import fs from 'fs'

class Config {
    private static instance: Config

    private secretFileFolder = path.join(__dirname, '..', '..', '.secrets')
    public filesToUploadPathFolder = path.join(__dirname, '..', '..', 'files-to-upload')
    public dummyUploadSourceFolder = path.join(__dirname, '..', '..', 'dummy-upload-source')
    public zipToUploadFolder = path.join(__dirname, '..', '..', 'zip-to-upload')

    public appKey: string = ''
    public appSecret: string = ''
    public authorizationCode: string = ''

    private constructor() {
        if (!fs.existsSync(this.secretFileFolder)) {
            fs.mkdirSync(this.secretFileFolder)
        }
        if (!fs.existsSync(this.filesToUploadPathFolder)) {
            fs.mkdirSync(this.filesToUploadPathFolder)
        }
        if (!fs.existsSync(this.dummyUploadSourceFolder)) {
            fs.mkdirSync(this.dummyUploadSourceFolder)
        }
        if (!fs.existsSync(this.zipToUploadFolder)) {
            fs.mkdirSync(this.zipToUploadFolder)
        }

        // read secrets from json file
        const secretsDataStr = fs.readFileSync(this.secretsPath)
        const secretsData = JSON.parse(secretsDataStr.toString())
        this.appKey = secretsData.appKey
        this.appSecret = secretsData.appSecret
        this.authorizationCode = secretsData.authorizationCode
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config()
        }

        return Config.instance
    }

    get accessTokenPath(): string {
        return path.join(this.secretFileFolder, 'access-token.json')
    }

    get refreshTokenPath(): string {
        return path.join(this.secretFileFolder, 'refresh-token.json')
    }

    get secretsPath(): string {
        return path.join(this.secretFileFolder, 'secrets.json')
    }
}

export default Config

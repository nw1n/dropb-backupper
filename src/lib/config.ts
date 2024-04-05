import path from 'path'
import fs from 'fs'

class Config {
    private static instance: Config

    private secretFilePathsBase = path.join(__dirname, '..', '..', '.secrets')
    public appKey: string = ''
    public appSecret: string = ''
    public authorizationCode: string = ''

    private constructor() {
        if (!fs.existsSync(this.secretFilePathsBase)) {
            fs.mkdirSync(this.secretFilePathsBase)
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
        return path.join(this.secretFilePathsBase, 'access-token.json')
    }

    get refreshTokenPath(): string {
        return path.join(this.secretFilePathsBase, 'refresh-token.json')
    }

    get secretsPath(): string {
        return path.join(this.secretFilePathsBase, 'secrets.json')
    }
}

export default Config

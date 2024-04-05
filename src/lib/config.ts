import path from 'path'

export interface SecretFilePaths {
    accesTokenFile: string
    refreshTokenFile: string
    secretsFile: string
}

const secretFilePaths: SecretFilePaths = {
    accesTokenFile: '',
    refreshTokenFile: '',
    secretsFile: '',
}

const base = path.join(__dirname, '..', '..', '.secrets')

secretFilePaths.accesTokenFile = path.join(base, 'access-token.json')
secretFilePaths.refreshTokenFile = path.join(base, 'refresh-token.json')
secretFilePaths.secretsFile = path.join(base, 'secrets.json')

export { secretFilePaths }

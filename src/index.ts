// src/index.ts
import express from 'express'
import { myName } from './lib/config'

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!')
})

app.listen(port, () => {
    console.log('Hello my Name is ' + myName)
    console.log(`Server is running on http://localhost:${port}`)
})

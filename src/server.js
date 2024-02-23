import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'

const __dirname = path.resolve()
const port = 5760

const app = express()
const server = http.createServer(app)

app.use(cors())

app.use('/', express.static(path.join(__dirname, '/src/app/')))

server.listen(port)
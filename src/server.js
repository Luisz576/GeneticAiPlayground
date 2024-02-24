import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'

const __dirname = path.resolve()
const port = 5760

const app = express()
const server = http.createServer(app)

app.use(cors())

app.use('/dino', express.static(path.join(__dirname, '/src/dino/')))
app.use('/pong', express.static(path.join(__dirname, '/src/pong/')))
app.use('/lib', express.static(path.join(__dirname, '/src/lib/')))

server.listen(port)
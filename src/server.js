import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { createGameServer } from './core/game_server.js'

const __dirname = path.resolve()
const port = 5760

const app = express()
const server = http.createServer(app)

app.use(cors())

app.use('/', express.static(path.join(__dirname, '/src/public')))
app.use('/shared', express.static(path.join(__dirname, '/src/core/shared')))

createGameServer(server)

server.listen(port)
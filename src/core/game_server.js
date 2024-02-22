import { Server } from 'socket.io'
import createGame from './shared/game.js'
import gameEvents from './shared/game_events.js'

export function createGameServer(server){
    const sockets = new Server(server)

    const game = createGame()
    game.addListener((command) => {
        console.log(`> Emitting ${command.type}`)
        sockets.emit(command.type, command)
    })
    game.state.cactus = {
        '334g34': {
            x: 12,
            height: 10
        }
    }

    sockets.on('connection', (socket) => {
        const listenerConnected = socket.id
        console.log(`Listener connected: ${listenerConnected}`)

        socket.emit(gameEvents.server2client.setup, game.state)

        socket.on(gameEvents.client2server.startDinos, (command) => {
            if(!game.state.running){
                game.start()
            }
        })

        socket.on(gameEvents.client2server.stopDinos, (command) => {
            game.setState({
                running: false,
                dinosaurs: {},
                cactus: {}
            })

            socket.emit(gameEvents.server2client.setup, game.state)
        })
    })
}
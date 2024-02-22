import { Server } from 'socket.io'
import createGame from './shared/game.js'
import gameEvents from './shared/game_events.js'

export function createGameServer(server){
    const sockets = new Server(server)

    const game = createGame(false)
    game.addListener((command) => {
        console.log(`Emitting '${command.type}'`)
        sockets.emit(command.type, command)
    })

    sockets.on('connection', (socket) => {
        const listenerConnected = socket.id
        console.log(`Listener connected: ${listenerConnected}`)
        socket.emit(gameEvents.server2client.setup, game.state)

        socket.on(gameEvents.client2server.startDinos, (_) => {
            if(!game.state.running){
                game.start()
            }
        })

        socket.on(gameEvents.client2server.stopDinos, (_) => {
            if(game.state.running){
                game.resetGame()

                socket.emit(gameEvents.server2client.setup, game.state)
            }
        })

        socket.on(gameEvents.client2server.saveDinos, (_) => {
            // TODO: save dinos
        })
    })
}
import createGame from '../shared/game.js'
import gameEvents from '../shared/game_events.js'

const game = createGame()

const socket = io()

socket.on(gameEvents.server2client.setup, (state) => {
    game.setState(state)
})

socket.on(gameEvents.server2client.dinoJump, (command) => {
    game.dinoJump(command)
})

socket.on(gameEvents.server2client.dinoDie, (command) => {
    game.dinoDie(command)
})

socket.on(gameEvents.server2client.setDinos, (command) => {
    game.setDinos(command)
})

socket.on(gameEvents.server2client.updateCactus, (command) => {
    game.updateCactus(command)
})
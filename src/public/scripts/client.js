import createGame from '../shared/game.js'
import gameEvents from '../shared/game_events.js'
import createGameRender from './game_render.js'

const canvas = document.getElementById('screen')
const generationText = document.getElementById('generation-span')

const game = createGame()
const gameRender = createGameRender(game, canvas, generationText)

gameRender.start()

const socket = io()

socket.on(gameEvents.server2client.setup, (state) => {
    console.log(gameEvents.server2client.setup, state)
    game.setState(state)
})

socket.on(gameEvents.server2client.dinoJump, (command) => {
    console.log(gameEvents.server2client.dinoJump, command)
    game.dinoJump(command)
})

socket.on(gameEvents.server2client.dinoDie, (command) => {
    console.log(gameEvents.server2client.dinoDie, command)
    game.dinoDie(command)
})

socket.on(gameEvents.server2client.setDinos, (command) => {
    console.log(gameEvents.server2client.setDinos, command)
    game.setDinos(command)
})

socket.on(gameEvents.server2client.setGeneration, (command) => {
    console.log(gameEvents.server2client.setGeneration, command)
    game.setGeneration(command)
})

socket.on(gameEvents.server2client.updateCactus, (command) => {
    console.log(gameEvents.server2client.updateCactus, command)
    game.updateCactus(command)
})

socket.on(gameEvents.server2client.gameSpeedUpdate, (command) => {
    console.log(gameEvents.server2client.gameSpeedUpdate, command)
    game.updateGameSpeed(command)
})

document.getElementById("btn-start-dinos").onclick = () => {
    socket.emit(gameEvents.client2server.startDinos, {
        type: gameEvents.client2server.startDinos
    })
}

document.getElementById("btn-stop-dinos").onclick = () => {
    socket.emit(gameEvents.client2server.stopDinos, {
        type: gameEvents.client2server.stopDinos
    })
}

document.getElementById("btn-save-dinos").onclick = () => {
    socket.emit(gameEvents.client2server.saveDinos, {
        type: gameEvents.client2server.saveDinos
    })
}
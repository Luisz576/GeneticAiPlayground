import createGame from "./game.js"

const canvas = document.getElementById('screen')
const generationText = document.getElementById('generation-span')
const aliveText = document.getElementById('alive-span')

const game = createGame(canvas, generationText, aliveText)

document.getElementById("btn-start-dinos").onclick = () => {
    game.start()
}

document.getElementById("btn-stop-dinos").onclick = () => {
    game.stop()
}

document.getElementById("btn-pause-dinos").onclick = () => {
    game.pause()
}

document.getElementById("btn-save-dinos").onclick = () => {
    // TODO
    console.log(game.getGenetic().population())
}

document.getElementById("btn-load-dinos").onclick = () => {
    // TOOD
}

document.getElementById("btn-next-tick-dinos").onclick = () => {
    game.nextTick()
}
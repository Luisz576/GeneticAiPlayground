import createGame from "./game.js"
import { downloadFile, loadFile, requestFile } from './file_manager.js'

const canvas = document.getElementById('screen')
const generationText = document.getElementById('generation-span')
const aliveText = document.getElementById('alive-span')
const scoreText = document.getElementById('score-span')
const speedLimitsBreakedText = document.getElementById('speed-limit-breaked-span')

const game = createGame(canvas, generationText, aliveText, scoreText, speedLimitsBreakedText, 20, 50)

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
    downloadFile({
        generation: game.getGeneration(),
        dinos: game.getGenetic().population()
    })
}

document.getElementById("btn-load-dinos").onclick = () => {
    requestFile((file) => {
        loadFile(file, (data) => {
            if(data
                && data['generation'] != undefined
                && data['dinos'] != undefined
                && Array.isArray(data['dinos'])){
                if(game.getGenetic().config().populationSize == data['dinos'].length){
                    game.loadDinos(data['generation'], data['dinos'])
                }else{
                    alert("game.populationSize != dinos.size")
                    console.error("game.populationSize != dinos.size")
                }
            }else{
                alert("Invalid data!")
                console.error("Invalid data!")
            }
        })
    })
}

document.getElementById("btn-next-tick-dinos").onclick = () => {
    game.nextTick()
}

document.getElementById("btn-increase-speed-dinos").onclick = () => {
    game.increaseSpeed(2)
}

document.getElementById("btn-break-limits-dinos").onclick = () => {
    game.breakSpeedLimits()
}

document.getElementById("btn-log-dinos").onclick = () => {
    console.log(game.state.dinosaurs)
}
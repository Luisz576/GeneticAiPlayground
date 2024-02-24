import createGame from "./game.js"
import { downloadFile, loadFile, requestFile } from './file_manager.js'

const canvas = document.getElementById('screen')
const generationText = document.getElementById('generation-span')
const aliveText = document.getElementById('alive-span')
const scoreText = document.getElementById('score-span')
const speedText = document.getElementById('speed-span')
const speedLimitsBreakedText = document.getElementById('speed-limit-breaked-span')

const game = createGame(canvas, generationText, aliveText, scoreText, speedLimitsBreakedText, speedText, 20, 50)

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
                    game.loadDinos(data['generation'], data['dinos'])
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
    game.increaseSpeed(1)
}

document.getElementById("btn-deincrease-speed-dinos").onclick = () => {
    game.increaseSpeed(-1)
}

document.getElementById("btn-break-limits-dinos").onclick = () => {
    game.breakSpeedLimits()
}

document.getElementById("btn-log-dinos").onclick = () => {
    console.log(game.state.dinosaurs)
}

document.getElementById("btn-ticks-dinos").onclick = () => {
    try{
        const ticks = Number(document.getElementById("ticks-value").value)
        if(ticks > 0){
            if(ticks <= 1000){
                game.changeGameTick(ticks)
            }else{
                throw "ticks needs to be less than 1000!"
            }
        }else{
            throw "ticks needs to be more than 0!"
        }
    }catch(e){
        console.error(e)
    }
}

document.getElementById("btn-set-speed-limit-dinos").onclick = () => {
    try{
        const speedLimit = Number(document.getElementById("speed-limit-value").value)
        if(speedLimit > 0){
            game.changeSpeedLimit(speedLimit)
        }else{
            throw "SpeedLimit needs to be more than 0!"
        }
    }catch(e){
        console.error(e)
    }
}
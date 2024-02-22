import createCactus from "./cactus.js"
import gameEvents from "./game_events.js"

const maxCactus = 1
const timeToUpdateSpeed = 20
const incrementSpeedValue = 10
const initialSpeed = 10

export default function createGame(clientSide = true){
    const observers = []
    const isClientSize = clientSide
    var updateSpeedCounter = 0
    var _runnerId
    const _defaultState = {
        currentGeneration: 0,
        gameSpeed: 0,
        running: false,
        dinosaurs: {},
        cactus: {}
    }
    const state = {}
    resetGame()

    function resetGame(){
        if(_runnerId){
            clearInterval(_runnerId)
        }
        const newState = {}
        Object.assign(newState, _defaultState)
        setState(newState)
    }

    function _run(){
        _updatePositions()

        if(!isClientSize){
            _shouldUpdateGameSpeedTick()
            if(Object.keys(state.cactus).length < maxCactus){
                _tryCreateCactus(100, 2)
            }
            _needDestroyCactus()
        }
    }

    function _shouldUpdateGameSpeedTick(){
        updateSpeedCounter++
        if(updateSpeedCounter > timeToUpdateSpeed){
            updateSpeedCounter = 0
            updateGameSpeed({
                speed: state.gameSpeed + incrementSpeedValue
            })
        }
    }

    function _updatePositions(){
        // TODO: update dinos

        for(let c in state.cactus){
            state.cactus[c].x -= state.gameSpeed
        }
    }

    function _needDestroyCactus(){
        var toDelete = []
        for(let c in state.cactus){
            const cactus = state.cactus[c]
            if(cactus.x < -10){
                toDelete.push(cactus.id)
            }
        }
        for(let c in toDelete){
            delete state.cactus[c]
        }
        if(toDelete.length > 0){
            updateCactus({
                cactus: state.cactus
            })
        }
    }

    function _tryCreateCactus(r, c){
        const rand = Math.floor(Math.random() * r)
        if(rand == 10){
            const cactus = createCactus(c)
            state.cactus[cactus.id] = cactus
            updateCactus({
                cactus: state.cactus
            })
        }
    }

    function start(){
        state.running = true

        _runnerId = setInterval(_run, 50)

        notifyAll({
            type: gameEvents.server2client.setup,
            state: state
        })
    }
    
    function addListener(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function dinoJump(command){
        const dinosaur = command.dinosaur

        if(dinosaur){
            if(state.dinosaurs[dinosaur]){
                state.dinosaurs[dinosaur].jumping = true

                notifyAll({
                    type: gameEvents.server2client.dinoJump,
                    dinosaur: command.dinosaur
                })
            }
        }
    }

    function updateGameSpeed(command){
        const speed = command.speed
        if(speed >= 0){
            state.gameSpeed = speed

            notifyAll({
                type: gameEvents.server2client.gameSpeedUpdate,
                speed: speed
            })
        }
    }

    function dinoDie(command){
        const dinosaur = command.dinosaur

        if(dinosaur){
            // TODO:

            notifyAll({
                type: gameEvents.server2client.dinoDie,
                dinosaur: command.dinosaur
            })
        }
    }

    function setDinos(command){
        const dinosaurs = command.dinosaurs
        if(dinosaurs){
            // TODO:

            notifyAll({
                type: gameEvents.server2client.setDinos,
                dinosaurs: command.dinosaurs
            })
        }
    }

    function updateCactus(command){
        const cactus = command.cactus

        if(cactus){
            state.cactus = cactus

            notifyAll({
                type: gameEvents.server2client.updateCactus,
                cactus: command.cactus
            })
        }
    }

    function setGeneration(command){
        const generation = command.generation
        if(generation > 0){
            // TODO:

            notifyAll({
                type: gameEvents.server2client.setGeneration,
                generation: command.generation
            })
        }
    }

    return {
        start,
        setState,
        resetGame,
        addListener,
        
        dinoJump,
        dinoDie,
        updateGameSpeed,
        setDinos,
        updateCactus,
        setGeneration,

        state
    }
}
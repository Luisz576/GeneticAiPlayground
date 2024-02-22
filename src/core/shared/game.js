import createCactus from "./cactus.js"
import gameEvents from "./game_events.js"

const maxCactus = 1
const timeToUpdateSpeed = 30
const incrementSpeedValue = 1
const initialSpeed = 10
const maxSpeed = 400
const jumpForce = 300 // ????

export default function createGame(clientSide = true){
    const observers = []
    const isClientSize = clientSide
    var updateSpeedCounter = 0
    var _runnerId
    const state = {}
    resetGame()

    function resetGame(){
        if(_runnerId){
            clearInterval(_runnerId)
        }
        setState({
            currentGeneration: 0,
            gameSpeed: initialSpeed,
            running: false,
            dinosaurs: {},
            cactus: {}
        })
    }

    function _run(){
        _updatePositions()
        console.log('tick')

        if(!isClientSize){
            _shouldUpdateGameSpeedTick()
            if(Object.keys(state.cactus).length < maxCactus){
                _tryCreateCactus(100, 2)
            }
            _needDestroyCactus()

            _updateDinoPopulation()
        }
    }

    function _updateDinoPopulation(){
        // TODO: Dino logic
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
            delete state.cactus[toDelete[c]]
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
        const dinosaurId = command.dinosaurId

        if(dinosaurId){
            if(state.dinosaurs[dinosaurId]){
                state.dinosaurs[dinosaurId].jumping = true

                notifyAll({
                    type: gameEvents.server2client.dinoJump,
                    dinosaurId: dinosaurId
                })
            }
        }
    }

    function updateGameSpeed(command){
        const speed = command.speed
        if(speed >= 0){
            state.gameSpeed = Math.min(speed, maxSpeed)

            notifyAll({
                type: gameEvents.server2client.gameSpeedUpdate,
                speed: state.gameSpeed
            })
        }
    }

    function dinoDie(command){
        const dinosaurId = command.dinosaurId

        if(dinosaurId){
            // TODO:

            notifyAll({
                type: gameEvents.server2client.dinoDie,
                dinosaurId: command.dinosaurId
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
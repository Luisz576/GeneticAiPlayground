import createCactus from "./cactus.js"
import createDinosaur from "./dinosaur.js"
import gameEvents from "./game_events.js"

const maxCactus = 1
const timeToUpdateSpeed = 50
const incrementSpeedValue = 1
const initialSpeed = 15
const maxSpeed = 80
const jumpForce = 300 // ????

export default function createGame(clientSide = true, genetic = undefined){
    const observers = []
    const isClientSide = clientSide
    var updateSpeedCounter = 0
    var _runnerId = -1
    const state = {}
    _resetState()

    function resetGame(){
        if(_runnerId){
            clearInterval(_runnerId)
            _runnerId = -1
        }
        _resetState()
        notifyAll({
            type: gameEvents.server2client.resetGame
        })
    }

    function _resetState(){
        setState({
            currentGeneration: 0,
            gameSpeed: initialSpeed,
            running: false,
            score: 0,
            dinosaurs: {},
            cactus: {}
        })
    }
    
    function _run(){
        if(state.running){
            _updatePositions()

            if(!isClientSide){
                state.score += state.gameSpeed
                _shouldUpdateGameSpeedTick()
                if(Object.keys(state.cactus).length < maxCactus){
                    _tryCreateCactus(100, 2)
                }
                _needDestroyCactus()
               
                _updateDinos()
            }
        }
    }

    function _updateDinos(){
        var someoneAlive = false
        for(let d in state.dinosaurs){
            const dino = state.dinosaurs[d]
            if(dino.state.alive && !_dinoWillDieAndKillIfItWill(dino)){
                someoneAlive = true
                let cactusDistance
                let cactusHeight
                const fc = _getFirstCactus()
                if(fc){
                    cactusDistance = fc.x - (dino.state.x + dino.state.body.width)
                    cactusHeight = fc.body.height
                }
                if(dino.itWillJump(cactusDistance, cactusHeight, state.gameSpeed)){
                    dinoJump({
                        dinosaurId: dino.state.id
                    })
                }
            }
        }
        if(!someoneAlive){
            _repopulateDinos()
        }
    }

    function _dinoWillDieAndKillIfItWill(dino){
        var res = false
        const fc = _getFirstCactus()
        if(fc){
            res = fc.canKill(dino.state.x, dino.state.y, dino.state.body.width, dino.state.body.height)
            console.log(fc.x, dino.state.x, dino.state.y, dino.state.body.width, dino.state.body.height, fc.canKill(dino.state.x, dino.state.y, dino.state.body.width, dino.state.body.height))
        }
        if(res){
            dinoDie({
                dinosaurId: dino.state.id,
                score: state.score
            })
        }
        return res
    }

    function _repopulateDinos(){
        // TODO: pega melhores dinos
        const bestDinos = undefined
        const running = state.running
        const currentGeneration = state.currentGeneration
        _resetState()

        state.running = running
        
        _doRepopulateDinos(currentGeneration + 1, bestDinos) // <- passar os melhores dinos

        notifyAll({
            type: gameEvents.server2client.setup,
            state: state
        })
    }

    function _doRepopulateDinos(newGeneration, bestDinos){
        if(isClientSide || genetic == undefined){
            return
        }
        if(bestDinos){
            genetic.evolve({
                population: bestDinos
            })
        }
        _spawnDinos()
        setGeneration({
            generation: newGeneration
        })
    }

    function  _spawnDinos(){
        const dinosPopulation = genetic.population()
        for(let d in dinosPopulation){
            const dino = createDinosaur(Math.random(), dinosPopulation[d])
            state.dinosaurs[dino.state.id] = dino
        }
        setDinos({
            dinosaurs: state.dinosaurs
        })
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

    function _getFirstCactus(){
        if(state && Object.keys(state.cactus).length > 0){
            return state.cactus[Object.keys(state.cactus)[0]]
        }
        return undefined
    }

    function _tryCreateCactus(r, c){
        const rand = Math.floor(Math.random() * r)
        if(rand > 90){
            const cactus = createCactus(c)
            state.cactus[cactus.id] = cactus
            updateCactus({
                cactus: state.cactus
            })
        }
    }

    function start(){
        if(!clientSide){
            _doRepopulateDinos(1)
            state.running = true
        }

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
        const score = command.score

        if(dinosaurId){
            if(state.dinosaurs[dinosaurId].alive){
                state.dinosaurs[dinosaurId].kill(score)
                
                notifyAll({
                    type: gameEvents.server2client.dinoDie,
                    dinosaurId: dinosaurId,
                    score: score
                })
            }
        }
    }

    function setDinos(command){
        const dinosaurs = command.dinosaurs
        if(dinosaurs){
            state.dinosaurs = dinosaurs

            notifyAll({
                type: gameEvents.server2client.setDinos,
                dinosaurs: state.dinosaurs
            })
        }
    }

    function updateCactus(command){
        const cactus = command.cactus

        if(cactus){
            state.cactus = cactus

            notifyAll({
                type: gameEvents.server2client.updateCactus,
                cactus: state.cactus
            })
        }
    }

    function setGeneration(command){
        const generation = command.generation
        if(generation > 0){
            state.currentGeneration = generation

            notifyAll({
                type: gameEvents.server2client.setGeneration,
                generation: state.currentGeneration
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
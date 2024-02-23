import createScoreManager from "./score_manager.js"
import createCactus from "./cactus.js"
import createDinosaur, { createDinosaurFromOther } from "./dinosaur.js"
import gameEvents from "./game_events.js"

const maxCactus = 1
const timeToUpdateSpeed = 20
const incrementSpeedValue = 2
const initialSpeed = 15
const maxSpeed = 80
const defaultPenality = 1000
const penalityReduction = 50

export default function createGame(clientSide = true, genetic = undefined){
    const observers = []
    const isClientSide = clientSide
    var updateSpeedCounter = 0
    var _runnerId = -1
    const state = {}
    const scoreManager = createScoreManager()
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

    function _resetState(protectScore = false){
        setState({
            currentGeneration: 0,
            gameSpeed: initialSpeed,
            running: false,
            score: 0,
            penality: defaultPenality,
            dinosaurs: {},
            cactus: {}
        })
        if(!protectScore){
            scoreManager.clear()
        }
    }

    var willUpdate = 0
    function _fixPositions(){
        willUpdate++
        if(willUpdate > 20){
            updateCactus({
                cactus: state.cactus
            })
            setDinos({
                dinosaurs: state.dinosaurs
            })
        }
    }
    
    function _run(){
        if(state.running){
            _updatePositions()
            _updateDinoCommon()

            if(!isClientSide){
                state.score += state.gameSpeed
                _shouldUpdateGameSpeedTick()
                if(Object.keys(state.cactus).length < maxCactus){
                    _tryCreateCactus(100, 2)
                }
                _needDestroyCactus()
                _updateDinos()
                _fixPositions()
            }
        }
    }

    function _updateDinoCommon(){
        for(let d in state.dinosaurs){
            state.dinosaurs[d]._updateDinoJumping()
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
        if(!genetic){
            throw "Server Side need have 'genetic'"
        }
        for(let d in state.dinosaurs){
            scoreManager.set(genetic.population()[d], state.dinosaurs[d].state.score)
        }
        const bestDinos = genetic.best()
        const running = state.running
        const currentGeneration = state.currentGeneration
        _resetState(true)

        state.running = running
        
        _doRepopulateDinos(currentGeneration + 1, bestDinos)

        _stateNotify()
    }

    function _stateNotify(){
        notifyAll({
            type: gameEvents.server2client.setup,
            state: state
        })
        notifyAll({
            type: gameEvents.server2client.setDinos,
            dinosaurs: state.dinosaurs
        })
    }

    function _doRepopulateDinos(newGeneration){
        if(isClientSide || genetic == undefined){
            return
        }
        if(newGeneration > 1){
            for(let i = 0; i < 10; i++) genetic.evolve()
        }
        _spawnDinos()
        setGeneration({
            generation: newGeneration
        })
    }

    function  _spawnDinos(){
        const dinosPopulation = genetic.population()
        for(let d in dinosPopulation){
            const dino = createDinosaur(d, Math.random(), dinosPopulation[d])
            dinosPopulation[d].id = dino.state.id
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
            state.penality -= penalityReduction
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
        _stateNotify()
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
                state.dinosaurs[dinosaurId].jump()

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
                console.log('dino Die: ', score - penality)
                state.dinosaurs[dinosaurId].state.score = score - penality
                state.dinosaurs[dinosaurId].state.alive = false
                
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
            if(clientSide){
                for(let d in dinosaurs){
                    const dino = createDinosaurFromOther(dinosaurs[d])
                    state.dinosaurs[dino.state.id] = dino
                }
                console.log('update', state.dinosaurs)
            }else{
                state.dinosaurs = dinosaurs
            }
            
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

    function aliveDinos(){
        let counter = 0
        for(let d in state.dinosaurs){
            if(state.dinosaurs[d].state.alive){
                counter++
            }
        }
        return counter
    }

    return {
        start,
        setState,
        resetGame,
        addListener,

        aliveDinos,
        
        dinoJump,
        dinoDie,
        updateGameSpeed,
        setDinos,
        updateCactus,
        setGeneration,

        scoreManager,
        state
    }
}
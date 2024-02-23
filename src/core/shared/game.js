import createDinosaur, { createDinosaurFromOther } from "./dinosaur.js"
import gameEvents from "./game_events.js"
import createGameRunner from "./game_runner.js"

const initialSpeed = 15
const maxSpeed = 80
const defaultPenality = 1000

export default function createGame(clientSide = true, genetic = undefined){
    const observers = []
    const isClientSide = clientSide
    var _runnerId = -1
    const state = {}
    _resetState()
    const gameRunner = createGameRunner(this)//TODO: error

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
            repopulating: false,
            score: 0,
            penality: defaultPenality,
            dinosaurs: {},
            cactus: {}
        })
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

    function _doRepopulateDinos(newGeneration, bestDinos){
        if(isClientSide || genetic == undefined){
            return
        }
        if(newGeneration > 1){
            genetic.evolve({
                population: [...bestDinos]
            })
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

    function start(){
        if(!clientSide){
            _doRepopulateDinos(1)
            state.running = true
        }

        _runnerId = setInterval(gameRunner.updateTick, 50)
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
        _stateNotify,
        resetGame,
        addListener,

        aliveDinos,
        
        dinoJump,
        dinoDie,
        updateGameSpeed,
        setDinos,
        updateCactus,
        setGeneration,
        
        _doRepopulateDinos,

        state,
        gameRunner,
        isClientSide
    }
}
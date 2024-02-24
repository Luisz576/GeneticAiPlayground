import createDinosaur from "./dinosaur.js"
import createCactus from './cactus.js'
import createDinoGenetic from "./dino_genetic.js"
import initialDinoPopulation from './initial_dino_population.js'
import createGameRender from "./game_render.js"
import phenotypeComparer from "./phenotype_comparer.js"

const initialSpeed = 20
const maxSpeed = 280
const defaultPenality = 10000
const maxCactus = 1
const timeToUpdateSpeed = 40
const incrementSpeedValue = 12
const penalityReduction = 50
const screenSize = 2400
const dinoBaseX = 40
const dinoSpawnDistanceRange = 150

export default function createGame(screen, generationText, aliveText, gameTicks = 20, populationSize = 20){
    const state = {}
    function callbackScore(phenotype){
        for(let d in state.dinosaurs){
            const dino = state.dinosaurs[d]
            if(phenotypeComparer(phenotype, dino.state.phenotype)){
                return dino.state.score
            }
        }
        return -defaultPenality
    }

    var genetic = createDinoGenetic(initialDinoPopulation, populationSize, callbackScore)
    _initializeGenetic()
    const render = createGameRender(screen, generationText, aliveText)
    var _runnerId = setInterval(updateTick, 1000/gameTicks)
    _resetState()
    var initGeneration = 1

    function _initializeGenetic(){
        for(let d in state.dinosaurs){
            state.dinosaurs[d].kill()
        }
        genetic = createDinoGenetic(initialDinoPopulation, populationSize, callbackScore)
        let eCounter = 0
        function _evolve(){
            if(eCounter > 20){
                throw "Couldn't evolute!"
            }
            try{
                genetic.evolve()
            }catch(e){
                eCounter++
                console.error('Error number ' + eCounter, e)
                _evolve()
            }
        } 
        _evolve()
    }

    function loadDinos(generation, dinoPopulation){
        stop()
        state.currentGeneration = generation
        initGeneration = generation
        genetic = genetic.clone({
            population: dinoPopulation
        })
        genetic.evolve()
    }

    function stop(){
        _initializeGenetic()
        _resetState()
    }
    function start(){
        if(!state.started){
            _doRepopulateDinos(initGeneration)
            initGeneration = 1
            state.started = true
        }
        state.running = true
    }
    function pause(){
        state.running = false
    }
    var allowOneMoreTick = false
    function nextTick(){
        allowOneMoreTick = true
    }

    function increaseSpeed(speed){
        state.gameSpeed += speed
    }

    function _resetState(){
        setState({
            currentGeneration: 0,
            gameSpeed: initialSpeed,
            running: false,
            started: false,
            repopulating: false,
            score: 0,
            penality: defaultPenality,
            dinosaurs: {},
            cactus: {}
        })
    }
    function setState(newState){
        Object.assign(state, newState)
    }

    function updateTick(){
        render.run(state, aliveDinos)
        if(state.running || allowOneMoreTick){
            allowOneMoreTick = false
            _updatePositions()
            state.score++
            _shouldUpdateGameSpeedTick()
            if(Object.keys(state.cactus).length < maxCactus){
                _tryCreateCactus(8, 3, 0)
            }
            _needDestroyCactus()
            _updateDinos()
        }
    }

    function _repopulateDinos(){
        state.repopulating = true
        let bestDinos = genetic.best()
        const running = state.running
        const started = state.started
        const currentGeneration = state.currentGeneration

        _resetState()
        state.started = started
        state.repopulating = true

        if(!Array.isArray(bestDinos)){
            bestDinos = [bestDinos]
        }
        _doRepopulateDinos(currentGeneration + 1, bestDinos)

        state.running = running
        state.gameSpeed = initialSpeed

        state.repopulating = false
    }

    function _doRepopulateDinos(newGeneration, bestDinos){
        if(newGeneration > 1 && initGeneration == 1){
            genetic.evolve({
                population: [...bestDinos]
            })
            for(let i = 0; i < 10; i++) genetic.evolve()
        }
        _spawnDinos()
        state.currentGeneration = newGeneration
    }

    function  _spawnDinos(){
        const dinosPopulation = genetic.population()
        for(let d in dinosPopulation){
            const dino = createDinosaur(d, dinoBaseX + Math.floor(Math.random() * dinoSpawnDistanceRange), Math.random(), dinosPopulation[d])
            dinosPopulation[d].id = dino.state.id
            state.dinosaurs[dino.state.id] = dino
        }
    }

    var waitToContinueAfterRepopulate = 0
    function _updateDinos(){
        for(let d in state.dinosaurs){
            const dino = state.dinosaurs[d]

            if(dino.state.alive && !_dinoWillDieAndKillIfItWill(dino)){
                dino.updateDinoJumping()

                let cactusDistance
                let cactusHeight
                const fc = _getFirstCactus()
                if(fc){
                    cactusDistance = fc.x - (dino.state.x + dino.state.body.width)
                    cactusHeight = fc.body.height * -1 // height is negative
                }

                if(dino.itWillJump(cactusDistance, cactusHeight, state.gameSpeed)){
                    dino.jump()
                }
            }
        }
        if(aliveDinos() == 0 && !state.repopulating){
            if(waitToContinueAfterRepopulate > 0){
                waitToContinueAfterRepopulate--
                return
            }
            _repopulateDinos()
            waitToContinueAfterRepopulate = 10
        }
    }

    function _updatePositions(){
        for(let c in state.cactus){
            state.cactus[c].x -= state.gameSpeed
        }
    }

    function _needDestroyCactus(){
        var toDelete = []
        for(let c in state.cactus){
            const cactus = state.cactus[c]
            if(cactus.x < -cactus.body.width){
                toDelete.push(cactus.id)
            }
        }
        for(let c in toDelete){
            delete state.cactus[toDelete[c]]
        }
        if(toDelete.length > 0){
            state.penality -= penalityReduction
        }
    }

    function _dinoWillDieAndKillIfItWill(dino){
        const fc = _getFirstCactus()
        if(fc != undefined){
            if(fc.canKill(dino.state.x, dino.state.y, dino.state.body.width, dino.state.body.height)){
                dino.kill(giveDinoScore(dino))
                return true
            }
        }
        return false
    }

    function giveDinoScore(dino){
        return state.score - state.penality - dino.state.y
    }

    function _tryCreateCactus(r, mr, c){
        const rand = Math.floor(Math.random() * r)
        if(rand > mr){
            const cactus = createCactus(screenSize, c)
            state.cactus[cactus.id] = cactus
        }
    }

    function _getFirstCactus(){
        if(state && Object.keys(state.cactus).length > 0){
            return state.cactus[Object.keys(state.cactus)[0]]
        }
        return undefined
    }

    var updateSpeedCounter = 0
    function _shouldUpdateGameSpeedTick(){
        updateSpeedCounter++
        if(updateSpeedCounter > timeToUpdateSpeed){
            updateSpeedCounter = 0
            updateGameSpeed(state.gameSpeed + incrementSpeedValue)
        }
    }

    function updateGameSpeed(speed){
        if(speed >= 0 && maxSpeed >= speed){
            state.gameSpeed = speed
        }
    }

    function aliveDinos(){
        let counter = 0
        for(let i in state.dinosaurs){
            if(state.dinosaurs[i].state.alive){
                counter++
            }
        }
        return counter
    }

    function getGenetic(){
        return genetic
    }

    function getGeneration(){
        return state.currentGeneration
    }

    return {
        start,
        stop,
        loadDinos,
        pause,
        nextTick,
        getGeneration,
        aliveDinos,
        increaseSpeed,
        getGenetic,
        state,
        _runnerId
    }
}
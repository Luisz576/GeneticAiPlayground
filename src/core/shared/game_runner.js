import createCactus from "./cactus.js"

const maxCactus = 1
const timeToUpdateSpeed = 20
const incrementSpeedValue = 2
const penalityReduction = 50

export default function createGameRunner(game){
    var updateSpeedCounter = 0
    
    function updateTick(){
        if(game.state.running){
            _updatePositions()
            _updateDinoCommon()

            if(!game.isClientSide){
                game.state.score += game.state.gameSpeed
                _shouldUpdateGameSpeedTick()
                if(Object.keys(game.state.cactus).length < maxCactus){
                    _tryCreateCactus(100, 2)
                }
                _needDestroyCactus()
                _updateDinos()
                _fixPositions()
            }
        }
    }

    function _updateDinoCommon(){
        for(let d in game.state.dinosaurs){
            game.state.dinosaurs[d]._updateDinoJumping()
        }
    }

    function _repopulateDinos(){
        if(!genetic){
            throw "Server Side need have 'genetic'"
        }
        game.state.repopulating = true
        let bestDinos = genetic.best()
        const running = game.state.running
        const currentGeneration = game.state.currentGeneration

        if(!Array.isArray(bestDinos)){
            bestDinos = [bestDinos]
        }

        game._doRepopulateDinos(currentGeneration + 1, bestDinos)

        game.state.running = running
        game.state.gameSpeed = initialSpeed

        game._stateNotify()
        game.state.repopulating = false
    }

    var waitToContinueAfterRepopulate = 0
    function _updateDinos(){
        var someoneAlive = false
        for(let d in game.state.dinosaurs){
            const dino = game.state.dinosaurs[d]
            if(dino.state.alive && !_dinoWillDieAndKillIfItWill(dino)){
                someoneAlive = true
                let cactusDistance
                let cactusHeight
                const fc = _getFirstCactus()
                if(fc){
                    cactusDistance = fc.x - (dino.state.x + dino.state.body.width)
                    cactusHeight = fc.body.height
                }
                if(dino.itWillJump(cactusDistance, cactusHeight, game.state.gameSpeed)){
                    game.dinoJump({
                        dinosaurId: dino.state.id
                    })
                }
            }
        }
        if(!someoneAlive && !state.repopulating){
            if(waitToContinueAfterRepopulate > 0){
                waitToContinueAfterRepopulate--
                return
            }
            _repopulateDinos()
            waitToContinueAfterRepopulate = 10
        }
    }

    function _updatePositions(){
        for(let c in game.state.cactus){
            game.state.cactus[c].x -= game.state.gameSpeed
        }
    }

    function _needDestroyCactus(){
        var toDelete = []
        for(let c in game.state.cactus){
            const cactus = game.state.cactus[c]
            if(cactus.x < -10){
                toDelete.push(cactus.id)
            }
        }
        for(let c in toDelete){
            delete game.state.cactus[toDelete[c]]
        }
        if(toDelete.length > 0){
            game.state.penality -= penalityReduction
            game.updateCactus({
                cactus: game.state.cactus
            })
        }
    }

    function _dinoWillDieAndKillIfItWill(dino){
        var res = false
        const fc = _getFirstCactus()
        if(fc){
            res = fc.canKill(dino.state.x, dino.state.y, dino.state.body.width, dino.state.body.height)
        }
        if(res){
            game.dinoDie({
                dinosaurId: dino.state.id,
                score: game.state.score
            })
        }
        return res
    }

    function _tryCreateCactus(r, c){
        const rand = Math.floor(Math.random() * r)
        if(rand > 90){
            const cactus = createCactus(c)
            state.cactus[cactus.id] = cactus
            game.updateCactus({
                cactus: state.cactus
            })
        }
    }

    function _getFirstCactus(){
        if(game.state && Object.keys(game.state.cactus).length > 0){
            return game.state.cactus[Object.keys(game.state.cactus)[0]]
        }
        return undefined
    }

    function _shouldUpdateGameSpeedTick(){
        updateSpeedCounter++
        if(updateSpeedCounter > timeToUpdateSpeed){
            updateSpeedCounter = 0
            game.updateGameSpeed({
                speed: game.state.gameSpeed + incrementSpeedValue
            })
        }
    }

    var willUpdate = 0
    function _fixPositions(){
        willUpdate++
        if(willUpdate > 10){
            willUpdate = 0
            game.updateCactus({
                cactus: state.cactus
            })
            game.setDinos({
                dinosaurs: state.dinosaurs
            })
        }
    }

    return {
        updateTick
    }
}
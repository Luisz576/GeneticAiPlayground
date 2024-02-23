const maxCactus = 1
const timeToUpdateSpeed = 20
const incrementSpeedValue = 2

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
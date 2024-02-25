export default function createGameRender(screen, generationText, aliveText, scoreText, speedLimitsBreakedText, speedText){
    const context = screen.getContext('2d')
    const floorY = screen.height

    function run(state, aliveDinos, baseScore){
        context.fillStyle = 'white'
        context.clearRect(0, 0, screen.width, screen.height)

        generationText.innerText = state.currentGeneration
        aliveText.innerText = aliveDinos
        scoreText.innerText = baseScore
        speedLimitsBreakedText.innerText = state.speedLimitsBreaked ? "Breaked" : "Limited"
        speedText.innerText = `${state.gameSpeed} / ${state.speedLimitsBreaked ? "Infinito" : state.speedLimit}`

        for(let c in state.cactus){
            _cactusRender(state.cactus[c])
        }
        for(let d in state.dinosaurs){
            if(state.dinosaurs[d].state.alive){
                _dinoRender(state.dinosaurs[d])
            }
        }
    }

    function _cactusRender(cactus){
        context.fillStyle = 'green'
        context.fillRect(cactus.x, floorY, cactus.body.width, cactus.body.height)
    }

    function _dinoRender(dino){
        // context.fillStyle = getColor(dino.state.opacity)
        // context.fillRect(dino.state.x, floorY + dino.state.y, dino.state.body.width, dino.state.body.height)
        context.globalAlpha = dino.state.opacity
        context.drawImage(dino.state.skin, dino.state.x, floorY + dino.state.y, dino.state.body.width, dino.state.body.height)
        context.globalAlpha = 1
    }

    function getColor(value){
        var hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",100%,50%)"].join("");
    }

    return {
        run
    }
}
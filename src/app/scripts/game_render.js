export default function createGameRender(screen, generationText, aliveText, scoreText){
    const context = screen.getContext('2d')
    const floorY = screen.height

    function run(state, aliveDinos, baseScore){
        context.fillStyle = 'white'
        context.clearRect(0, 0, screen.width, screen.height)

        generationText.innerText = state.currentGeneration
        aliveText.innerText = aliveDinos
        scoreText.innerText = baseScore

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
        context.fillStyle = getColor(dino.state.opacity)
        context.fillRect(dino.state.x, floorY + dino.state.y, dino.state.body.width, dino.state.body.height)
    }

    function getColor(value){
        //value from 0 to 1
        var hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",100%,50%)"].join("");
    }

    return {
        run
    }
}
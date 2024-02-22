export default function gameRender(game, screen, generationText, requestAnimationFrame){
    const context = screen.getContext('2d')
    const floorY = screen.height

    function _run(){
        context.fillStyle = 'white'
        context.clearRect(0, 0, screen.width, screen.height)

        generationText.innerText = game.state.currentGeneration

        for(let c in game.state.cactus){
            _cactusRender(game.state.cactus[c])
        }
        for(let d in game.state.dinosaurs){
            if(game.state.dinosaurs[d].state.alive){
                _dinoRender(game.state.dinosaurs[d])
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

    _run()

    requestAnimationFrame(() => {
        gameRender(game, screen, generationText, requestAnimationFrame)
    })
}
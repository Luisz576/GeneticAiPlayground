const floorY = 0

export default function gameRender(game, screen, generationText, requestAnimationFrame){
    const canvas = screen.getContext('2d')

    function _run(){
        generationText.innerText = game.state.currentGeneration
        // TODO: draw
        for(let c in game.state.cactus){
            _cactusRender(game.state.cactus[c])
        }
    }

    function _cactusRender(cactus){
        context.fillStyle = 'black'
        context.fillRect(cactus.x, floorY, cactus.body.width, cactus.body.height)
    }

    requestAnimationFrame(() => {
        gameRender(game, screen, generationText, requestAnimationFrame)
    })
}
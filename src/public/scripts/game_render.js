export default function gameRender(game, screen, generationText, requestAnimationFrame){
    const context = screen.getContext('2d')
    const floorY = screen.height

    function _run(){
        context.fillStyle = 'white'
        context.clearRect(0, 0, screen.width, screen.height)

        generationText.innerText = game.state.currentGeneration
        // TODO: draw
        for(let c in game.state.cactus){
            _cactusRender(game.state.cactus[c])
        }
    }

    function _cactusRender(cactus){
        context.fillStyle = 'green'
        context.fillRect(cactus.x, floorY, cactus.body.width, cactus.body.height)
    }

    _run()

    requestAnimationFrame(() => {
        gameRender(game, screen, generationText, requestAnimationFrame)
    })
}
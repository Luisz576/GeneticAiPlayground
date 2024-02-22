export default function createGameRender(gameInstance, canvasInstance, generationTextInstance){
    const game = gameInstance
    const canvas = canvasInstance
    const generationText = generationTextInstance

    function start(){
        setInterval(_run, 50)
    }

    function _run(){
        generationText.innerText = game.state.currentGeneration
        // TODO: draw
        for(let c in game.state.cactus){
            _cactusRender(game.state.cactus[c])
        }
    }

    function _cactusRender(cactus){
        
    }

    return {
        game,
        start
    }
}
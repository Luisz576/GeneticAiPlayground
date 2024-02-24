import { Game, GameComponent } from "./LCanvas.js"
import Ball from "./ball.js"
import phenotypeComparer from "./phenotype_comparer.js"
import Player from "./player.js"
import { createPongGenetic } from "./pong_genetic.js"

export default function createGame(canvas, configs, frames){
    // GAME
    var started = false
    const game = new Game(canvas)
    const pongGenetic = createPongGenetic(scoreCalculator)

    pongGenetic.evolve()

    const j1 = new Player(1, configs.jogador1.position.x, configs.jogador1.position.y, configs.jogadores.width, configs.jogadores.height, configs.jogadores.speed, configs.jogador1.keyUp, configs.jogador1.keyDown, "s", configs.color, true, pongGenetic.population()[0])
    const j2 = new Player(2, configs.jogador2.position.x, configs.jogador2.position.y, configs.jogadores.width, configs.jogadores.height, configs.jogadores.speed, configs.jogador2.keyUp, configs.jogador2.keyDown, configs.color, true, pongGenetic.population()[1])
    const ball = new Ball(configs.ball.position.x, configs.ball.position.y, configs.ball.size, configs.ball.speed, configs.color, winnerCallback)

    function scoreCalculator(phenotype){
        if(started){
            if(phenotypeComparer(j1.phenotype, phenotype)){
                if(game.winner == 1){
                    return 10000
                }else{
                    let dX = ball.position.x - j1.position.x
                    if(dX > 0) dX *= -1
                    let dY = ball.position.y - j1.position.x
                    if(dY > 0) dY *= -1
                    return dX + dY
                }
            }
            if(phenotypeComparer(j2.phenotype, phenotype)){
                if(game.winner == 2){
                    return 10000
                }else{
                    let dX = ball.position.x - j2.position.x
                    if(dX > 0) dX *= -1
                    let dY = ball.position.y - j2.position.x
                    if(dY > 0) dY *= -1
                    return dX + dY
                }
            }
        }
        return -1000
    }

    function winnerCallback(winner) {
        game.gameState = 2
        game.winner = winner
        console.log("Winner: " + winner)
        setTimeout(_resetGame, 3000/frames)
    }

    function _resetGame(){
        ball.reset(configs.ball.position.x, configs.ball.position.y, configs.ball.size, configs.ball.speed, configs.color)
        game.gameState = 1
        game.winner = -1
        // TODO: get best
        pongGenetic.evolve({
            population: pongGenetic.elitePhenotypes()
        })
        j1.position = {x: configs.jogador1.position.x, y: configs.jogador1.position.y}
        j1.phenotype = pongGenetic.population()[0]

        j2.position = {x: configs.jogador2.position.x, y: configs.jogador2.position.y}
        j2.phenotype = pongGenetic.population()[1]
    }

    game.gameState = 1
    game.winner = -1
    game.setInfo({gameState: game.gameState, j1, j2, ball, game})
    game.addEventListener("updateFrame", (_canvas, info) => {
        info.gameState = game.gameState
        game.setInfo(info)
    })
    game.addEventListener('renderFrame', (canvas, canvasContext, info) => {
        if(info.gameState == 2){
            GameComponent.createText(canvasContext, "O jogador " + game.winner + " venceu!", canvas.width / 2 - 80, canvas.height / 2 - 20)
        }
    })

    game.runGame(frames)
    started = true

    return {
        game,
        j1,
        j2,
        ball
    }
}
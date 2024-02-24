import createGame from "./pong.js"

const canvas = document.querySelector('canvas')

const configs = {
    color: "black",
    jogadores: {
        width: 10,
        height: 60,
        speed: 10,
    },
    jogador1: {
        keyUp: "w",
        keyDown: "s",
        position: {
            x: 10,
            y: canvas.height / 2 - 30
        }
    },
    jogador2: {
        keyUp: "ArrowUp",
        keyDown: "ArrowDown",
        position: {
            x: canvas.width - 20,
            y: canvas.height / 2 - 30
        }
    },
    ball: {
        size: 10,
        speed: 4,
        position: {
            x: canvas.width / 2 - 10,
            y: canvas.height / 2 - 10
        }
    }
}

document.getElementById('start-game').onclick = (_event) => {
    try{
        const frames = Number(document.getElementById('frames-value').value)
        if(frames < 0 || frames > 1000){
            throw "Invalid 'frames' value"
        }

        const game = createGame(canvas, configs, frames)
        
        document.getElementById('frames-value').remove()
        document.getElementById('start-game').innerText = "Log"
        document.getElementById('start-game').onclick = () => {
            console.log(game.j1, game.j2)
        }
    }catch(e){
        console.error(e)
    }
}
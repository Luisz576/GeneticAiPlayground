import { GameComponent } from './LCanvas.js'

export default class Ball extends GameComponent{
    constructor(x, y, size, speed, color, callbackEndGame){
        super()
        this.position = {x, y}
        this.direction = this.createDiretion()
        this.speed = speed
        this.callbackEndGame = callbackEndGame
        this.size = size
        this.color = color
    }
    createDiretion(){
        return {
            x: Math.floor(Math.random() * 2) == 1 ? 1 : -1,
            y: Math.floor(Math.random() * 2) == 1 ? 1 : -1
        }
    }
    reset(x, y, size, speed, color){
        this.position = {x, y}
        this.direction = this.createDiretion()
        this.speed = speed
        this.size = size
        this.color = color
    }
    Update(canvas, info){
        if(info.gameState == 1){
            const futureBallX = this.position.x + this.speed * this.direction.x
            const futureBallY = this.position.y + this.speed * this.direction.y
            // Y CHANGES
            if(futureBallY + this.size <= 0)
                this.direction.y = 1
            if(futureBallY + this.size >= canvas.height)
                this.direction.y = -1
            // X CHANGES
            if((futureBallX + this.size < info.j1.position.x + info.j1.width &&
                futureBallY + this.size > info.j1.position.y &&
                futureBallY + this.size < info.j1.position.y + info.j1.height) ||
                (futureBallX + this.size > info.j2.position.x + info.j2.width &&
                    futureBallY + this.size > info.j2.position.y &&
                    futureBallY + this.size < info.j2.position.y + info.j2.height))
                    this.direction.x *= -1
            // MOVE
            this.position.x += this.speed * this.direction.x
            this.position.y += this.speed * this.direction.y
            if(this.position.x <= 0)
                this.callbackEndGame(2)
            if(this.position.x >= canvas.width)
                this.callbackEndGame(1)
        }
    }
    Render(_canvas, canvasContext, _info){
        GameComponent.createRect(canvasContext, this.position.x, this.position.y, this.size, this.size, this.color)
    }
}
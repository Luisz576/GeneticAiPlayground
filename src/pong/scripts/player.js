import { GameComponent } from './LCanvas.js'
import iaLogic from './ia_logic.js'

export default class Player extends GameComponent{
    constructor(playerId, x, y, width, height, speed, keyUp, keyDown, color, isRobot = false, phenotype = undefined){
        super()
        this.position = {x, y}
        this.width = width
        this.height = height
        this.speed = speed
        this.keyUp = keyUp
        this.playerId = playerId
        this.isRobot = isRobot
        this.isNotARobot = !isRobot
        this.keyDown = keyDown
        this.color = color

        this.phenotype = phenotype
        if(this.isRobot && !this.phenotype){
            throw "A robot need a 'phenotype'"
        }
    }
    Update(canvas, info){
        if(this.isRobot && info.gameState == 1){
            let action = iaLogic(this, canvas, info, this.phenotype)
            if(action >= 1){
                this.position.y -= this.speed
            }else if(action <= -1){
                this.position.y += this.speed
            }
        }
    }
    KeyDown(event, info){
        if(this.isNotARobot && info.gameState == 1){
            const key = event.key
            if(key == this.keyUp){
                this.position.y -= this.speed
            }
            if(key == this.keyDown){
                this.position.y += this.speed
            }
        }
    }
    Render(_canvas, canvasContext, _info){
        GameComponent.createRect(canvasContext, this.position.x, this.position.y, this.width, this.height, this.color)
    }
}
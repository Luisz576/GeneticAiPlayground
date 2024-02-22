const dinoX = 50
const defaultDinoSize = {
    width: 80,
    height: -120,
}

const gravitySpeed = 4
const jumpForce = 300

export function createDinosaurFromOther(dinosaur = createDinosaur()){
    const state = {
        id: dinosaur.state.id,
        jumping: dinosaur.state.jumping,
        jumpForce: dinosaur.state.jumpForce,
        opacity: dinosaur.state.opacity,
        y: dinosaur.state.y,
        x: dinosaur.state.x,
        alive: dinosaur.state.alive,
        score: dinosaur.state.score,
        body: Object.assign({}, dinosaur.state.body)
    }

    function _updateDinoJumping(){
        if(this.state.jumping){
            this.state.jumpForce -= gravitySpeed
            this.state.y += this.state.jumpForce
            this.state.y = Math.max(this.state.y, 0)
            if(this.state.y == 0){
                this.state.jumping = false
            }
        }
    }
    
    function jump(){
        if(!this.state.jumping){
            this.state.jumping = true
            this.state.jumpForce = jumpForce
        }
    }
    
    function kill(score){
        this.state.score = score
        this.state.alive = false
    }

    return {
        kill,
        _updateDinoJumping,
        jump,
        state
    }
}

export default function createDinosaur(opacity, phenotype){
    const state = {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        jumping: false,
        jumpForce: 0,
        opacity: opacity,
        y: 0,
        x: dinoX,
        alive: true,
        score: 0,
        body: Object.assign({}, defaultDinoSize)
    }
    
    function itWillJump(cactusDistance, cactusHeight, gameSpeed){
        if(phenotype){
            // cd => cactusDistance
            // ch => cactusHeight
            // gs => gameSpeed
            // mptj => minimalPercentToJump
            return phenotype.cd * cactusDistance + phenotype.ch * cactusHeight + phenotype.gs * gameSpeed > phenotype.mptj
        }
        return false
    }

    function _updateDinoJumping(){
        if(this.state.jumping){
            this.state.jumpForce -= gravitySpeed
            this.state.y += this.state.jumpForce
            this.state.y = Math.max(this.state.y, 0)
            if(this.state.y == 0){
                this.state.jumping = false
            }
        }
    }
    
    function jump(){
        if(!this.state.jumping){
            this.state.jumping = true
            this.state.jumpForce = jumpForce
        }
    }
    
    function kill(score){
        this.state.score = score
        this.state.alive = false
    }

    return {
        state,
        kill,
        _updateDinoJumping,
        jump,
        itWillJump
    }
}
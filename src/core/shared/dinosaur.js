const dinoX = 50
const defaultDinoSize = {
    width: 80,
    height: -120,
}

const gravitySpeed = -5
const jumpForce = -50

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
        if(state.jumping){
            state.jumpForce -= gravitySpeed
            state.y += state.jumpForce
            state.y = Math.min(state.y, 0)
            if(state.y == 0){
                state.jumping = false
            }
        }
    }
    
    function jump(){
        if(!state.jumping){
            state.jumping = true
            state.jumpForce = jumpForce
        }
    }
    
    function kill(score){
        state.score = score
        state.alive = false
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
        if(state.jumping){
            state.jumpForce -= gravitySpeed
            state.y += state.jumpForce
            state.y = Math.min(state.y, 0)
            if(state.y == 0){
                state.jumping = false
            }
        }
    }
    
    function jump(){
        if(!state.jumping){
            state.jumping = true
            state.jumpForce = jumpForce
        }
    }
    
    function kill(score){
        state.score = score
        state.alive = false
    }

    return {
        state,
        kill,
        _updateDinoJumping,
        jump,
        itWillJump
    }
}
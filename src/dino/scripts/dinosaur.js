import createSkin from "./createSkin.js"

const defaultDinoSize = {
    width: 120,
    height: -180,
}
const gravitySpeed = -10
const jumpForce = -100

const skinImg = createSkin("./images/dino.png")

export default function createDinosaur(id, x, opacity, phenotype){
    const state = {
        id: id != undefined ? id : (Date.now() + Math.floor(Math.random() * 100)).toString(),
        jumping: false,
        jumpForce: 0,
        opacity: opacity < 0.15 ? 0.15 : opacity,
        y: 0,
        x: x,
        skin: skinImg,
        alive: true,
        phenotype: phenotype,
        score: 0,
        body: Object.assign({}, defaultDinoSize)
    }
    
    function itWillJump(cactusDistance, cactusHeight, cactusWidth, gameSpeed){
        if(phenotype){
            // cd => cactusDistance
            // ch => cactusHeight
            // cw => cactusWidth
            // gs => gameSpeed
            // mptj => minimalPercentToJump
            // return phenotype.cd * cactusDistance + phenotype.ch * cactusHeight + phenotype.cw * cactusWidth + phenotype.gs * gameSpeed  > 0//< phenotype.mptj
            return (phenotype.cd * cactusDistance + phenotype.ch * cactusHeight + phenotype.cw * cactusWidth) * phenotype.gs * gameSpeed  > 0
        }
        return false
    }

    function updateDinoJumping(){
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
        state.alive = false
        state.score = score
    }

    return {
        state,
        updateDinoJumping,
        jump,
        kill,
        itWillJump
    }
}
const dinoX = 50
const defaultDinoSize = {
    width: 80,
    height: -120,
}

export default function createDinosaur(opacity, phenotype){
    const state = {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        jumping: false,
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

    function kill(score){
        state.score = score
        state.alive = false
    }

    return {
        state,
        kill,
        itWillJump
    }
}
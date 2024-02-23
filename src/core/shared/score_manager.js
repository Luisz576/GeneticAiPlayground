export default function createScoreManager(){
    const state = {
        scores: []
    }
    // cd => cactusDistance
    // ch => cactusHeight
    // gs => gameSpeed
    // mptj => minimalPercentToJump
    function get(phenotype){
        if(phenotype){
            for(let i in state.scores){
                let score = state.scores[i]
                if(score.cd == phenotype.cd
                    && score.ch == phenotype.ch
                    && score.gs == phenotype.gs
                    && score.mptj == phenotype.mptj){
                        return score.score
                }
            }
        }
        return -1000
    }

    function set(phenotype, score){
        console.log("set score", score)
        const v = Object.assign({}, phenotype)
        v['score'] = score
        state.scores.push(v)
    }

    function clear(){
        while(state.scores.length > 0){
            state.scores.pop()
        }
    }

    return {
        state,
        get,
        clear,
        set
    }
}
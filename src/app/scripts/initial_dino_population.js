const initialDinoPopulation = [
    createDefault()
]

function createDefault(){
    return {
        cd: Math.random() * 5,
        ch: Math.random() * 5,
        gs: Math.random() * 5,
        mptj: Math.random() * 1000,
    }
}

export default initialDinoPopulation
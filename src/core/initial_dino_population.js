const initialDinoPopulation = [
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
]

function createDefault(){
    return {
        cd: Math.random() * 5,
        ch: Math.random() * 5,
        gs: Math.random() * 5,
        mptj: Math.random() * 10
    }
}

export default initialDinoPopulation
const initialDinoPopulation = [
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault(),
    createDefault()
]

function createDefault(){
    return {
        cd: Math.random() * 5 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
        ch: Math.random() * 5 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
        gs: Math.random() * 5 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
        // mptj: Math.random() * 100,
    }
}

export default initialDinoPopulation
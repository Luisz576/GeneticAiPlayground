import createGenetic from "../../lib/genetic.js";

const g = createGenetic({
    elite: 3,
    crossoverFunction: crossover,
    doesABeatBFunction: doesABeatBFunction,
    fitnessFunction: fitness,
    mutationFunction: mutation,
    population: generatePopulation(),
    mutationPercent: 0.1,
    populationSize: 50
})

function crossover(x, y){
    let i = randInt(x.length)
    let aux = y[i]
    x[i] = y[i]
    y[i] = aux
    return [x, y]
}

function doesABeatBFunction(a, b){
    let aS = fitness(a)
    let bS = fitness(b)

    if(aS > bS){
        if(randInt(10) > 7){
            return false
        }
        return true
    }
    return false
}

function fitness(p){

}

function mutation(p){
    let i = randInt(p.length)
    p[i] = p[i] == 0 ? 1 : 0
    return p
}

function generatePopulation(){
    const pop = []
    for(let i = 0; i < 25; i++) pop.push(generateRandomArray())
    return pop
}
function generateRandomArray(){
    const arr = []
    for(let i = 0; i < 21; i++) arr.push(randInt())
    return arr
}

const keys = ['HighBP','HighChol','CholCheck','BMI','Smoker','Stroke','HeartDiseaseorAttack','PhysActivity','Fruits','Veggies','HvyAlcoholConsump','AnyHealthcare','NoDocbcCost','GenHlth','MentHlth','PhysHlth','DiffWalk','Sex','Age','Education','Income']

function randInt(n = 2){
    return Math.floor(Math.random() * n)
}

export default function run(csv){
    let running = true
    while(running){
        // TODO ver na pratica
    }
}
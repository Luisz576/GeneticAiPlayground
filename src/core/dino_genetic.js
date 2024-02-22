import geneticAlgorithmConstructor from 'geneticalgorithm'

// cd => cactusDistance
// ch => cactusHeight
// gs => gameSpeed
// mptj => minimalPercentToJump
export default function createDinoGenetic(initialPopulation, populationSize = 50){
    function mutationFunction(phenotype){
        phenotype.cd += calculateMutation();
        phenotype.ch += calculateMutation()
        phenotype.gs += calculateMutation()
        phenotype.mptj += 2 * calculateMutation()
        return phenotype
    }

    function calculateMutation(){
        return 3*(Math.random()*2 - 1)*(Math.random()*2 - 1)*(Math.random()*2 - 1)
    }

    function crossoverFunction(a, b){
        const x = cloneJSON(a)
        const y = cloneJSON(b)
        let aux
        switch(Math.floor(Math.random() * 4)){
            case 0:
                aux = x.cd
                x.cd = y.cd
                y.cd = x.cd
                break
            case 1:
                aux = x.ch
                x.ch = y.ch
                y.ch = x.ch
                break
            case 2:
                aux = x.gs
                x.gs = y.gs
                y.gs = x.gs
                break
            case 3:
                aux = x.mptj
                x.mptj = y.mptj
                y.mptj = x.mptj
                break
        }
        return Math.random() < .5 ? [x,y] : [y,x];
    }

    function fitnessFunction(phenotype){
        return 0
    }

    function doesABeatBFunction(a, b){
        const aScore = fitnessFunction(a)
        const bScore = fitnessFunction(b)
        
        if(aScore > 0 && bScore < 0) return Math.floor(Math.random() * 10) = 1

        return aScore - bScore
    }

    const g = geneticAlgorithmConstructor({
        mutationFunction: mutationFunction,
        crossoverFunction: crossoverFunction,
        fitnessFunction: fitnessFunction,
        doesABeatBFunction: doesABeatBFunction,
        population: initialPopulation,
        populationSize: populationSize
    });

    return g
}
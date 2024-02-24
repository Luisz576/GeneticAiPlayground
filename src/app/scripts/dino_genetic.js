import geneticAlgorithmConstructor from './lib/geneticalgorithm.js'

// cd => cactusDistance
// ch => cactusHeight
// gs => gameSpeed
// mptj => minimalPercentToJump
export default function createDinoGenetic(initialPopulation, populationSize, callbackScore){
    function mutationFunction(phenotype){
        phenotype.cd += calculateBaseMutation()
        phenotype.ch += calculateBaseMutation()
        phenotype.gs += calculateBaseMutation()
        // phenotype.mptj += 5 * calculateBaseMutation()
        return phenotype
    }

    function calculateBaseMutation(){
        return ((Math.floor(Math.random() * 2) == 1) ? 1 : -1) * (Math.random()*2 - 1) * (Math.random()*2 - 1) * (Math.random()*2 - 1)
    }

    function crossoverFunction(a, b){
        const x = cloneJSON(a)
        const y = cloneJSON(b)
        let aux
        // Math.floor(Math.random() * 4)
        switch(Math.floor(Math.random() * 3)){
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
            // case 3:
            //     aux = x.mptj
            //     x.mptj = y.mptj
            //     y.mptj = x.mptj
            //     break
        }
        return Math.random() < .5 ? [x,y] : [y,x];
    }

    function fitnessFunction(phenotype){
        return callbackScore(phenotype)
    }

    function doesABeatBFunction(a, b){
        const aScore = fitnessFunction(a)
        const bScore = fitnessFunction(b)
        
        if(aScore > bScore){
            if(bScore > 0 && ((aScore / bScore) < 2)){
                return Math.random() > 0.9
            }
            return true
        }
        if(aScore > 0 && bScore > 0) return Math.random() > 0.8

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
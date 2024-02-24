import createGenetic from "../../lib/genetic.js"
import initialPopulation from "./initial_population.js"

export function createPongGenetic(callbackScore){
    function crossoverFunction(phenotypeA, phenotypeB){
        phenotypeA.bdx = phenotypeB.bdx
        phenotypeB.bdy = phenotypeA.bdy
        return [phenotypeA, phenotypeB]
    }

    function doesABeatBFunction(phenotypeA, phenotypeB){
        const aScore = fitnessFunction(phenotypeA)
        const bScore = fitnessFunction(phenotypeB)
        if(aScore > bScore){
            if(bScore > 0 && ((aScore / bScore) < 2)){
                return Math.random() > 0.9
            }
            return true
        }
        if(aScore > 0 && bScore > 0) return Math.random() > 0.8
        return aScore - bScore
    }

    function fitnessFunction(phenotype){
        return callbackScore(phenotype)
    }

    function mutationFunction(phenotype){
        phenotype.bdx += 1.5 * calculateBaseMutation()
        phenotype.bdy += 1.5 * calculateBaseMutation()
        return phenotype
    }

    function calculateBaseMutation(){
        return ((Math.floor(Math.random() * 2) == 1) ? 1 : -1) * (Math.random()*2 - 1) * (Math.random()*2 - 1) * (Math.random()*2 - 1)
    }

    const g = createGenetic({
        elite: 1,
        mutationPercent: 0.2,
        crossoverFunction: crossoverFunction,
        doesABeatBFunction: doesABeatBFunction,
        fitnessFunction: fitnessFunction,
        mutationFunction: mutationFunction,
        population: initialPopulation,
        populationSize: 2,
    })

    return g
}
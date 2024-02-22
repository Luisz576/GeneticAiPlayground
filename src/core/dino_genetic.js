import geneticAlgorithmConstructor from 'geneticalgorithm'

export default function createDinoGenetic(initialPopulation, populationSize = 50){
    function mutationFunction(phenotype){
        return phenotype
    }

    function crossoverFunction(a, b){
        return [b,a]
    }

    function fitnessFunction(phenotype){
        return 0
    }

    function doesABeatBFunction(a, b){
        return 0
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
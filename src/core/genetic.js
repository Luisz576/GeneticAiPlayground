import GeneticAlgorithm from 'geneticalgorithm'
function cloneJSON( item ) { return JSON.parse ( JSON.stringify ( item ) ) }

export class Genetic{
    defaultSettings(){
        return {
            populationSize: 50,
            initialPopulation: [{}],
            doesABeatBFunction: undefined
        }
    }

    constructor(settings = this.defaultSettings()){
        this.g = geneticAlgorithmConstructor({
            mutationFunction: this.mutationFunction.bind(this),
            crossoverFunction: this.crossoverFunction.bind(this),
            fitnessFunction: this.fitnessFunction.bind(this),
            doesABeatBFunction: settings.doesABeatBFunction ?? this.defaultSettings().doesABeatBFunction,
            population: settings.initialPopulation ?? this.defaultSettings().initialPopulation,
            populationSize: settings.populationSize ?? this.defaultSettings().populationSize
        });
    }

    mutationFunction(phenotype){

    }

    crossoverFunction(a, b){

    }

    fitnessFunction(phenotype){

    }
}
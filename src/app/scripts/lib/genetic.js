export default function createGenetic(options = defaultSettings()){
    function cloneJson(json){
        return JSON.parse(JSON.stringify(json))
    }
    function randomInteger(n){
        return Math.floor(Math.random() * n)
    }

    function defaultSettings() {
        return {
            mutationFunction : function(phenotype) { return phenotype },
            crossoverFunction : function(a,b) { return [a,b] },
            fitnessFunction : function(phenotype) { return 0 },
            doesABeatBFunction : undefined,
            mutationPercent: 0.5,
            elite: 1,
            population : [],
            populationSize : 100,
        }
    }
    function settingsWithDefaults(settings, defaults) {
        settings = settings || {}

        settings.mutationFunction = settings.mutationFunction || defaults.mutationFunction
        settings.crossoverFunction = settings.crossoverFunction || defaults.crossoverFunction
        settings.fitnessFunction = settings.fitnessFunction || defaults.fitnessFunction
        settings.doesABeatBFunction = settings.doesABeatBFunction || defaults.doesABeatBFunction
        settings.mutationPercent = settings.mutationPercent || defaults.mutationPercent
        settings.elite = settings.elite || defaults.elite
        settings.population = settings.population || defaults.population
        
        if (settings.population.length <= 0)
            throw Error("'population' is empty! It needs start with at least 1 phenotype!")

        settings.populationSize = settings.populationSize || defaults.populationSize
        if (settings.populationSize <= 0)
            throw Error("'populationSize' must be greater than 0")
        if (settings.populationSize < settings.elite)
            throw Error("'populationSize' must be greater than or equal to 'elite'")

        return settings
    }
    var settings = settingsWithDefaults(options, defaultSettings())

    function populate(){
        var size = settings.population.length
        while(settings.population.length < settings.populationSize){
            settings.population.push(
                mutate(
                    cloneJson(settings.population[randomInteger(size)])
                )
            )
        }
    }

    function randomizePopulationOrder(){
        for(let i = 0; i < settings.population.length; i++) {
            let toChangeIndex = randomInteger(settings.population.length)
            let aux = settings.population[toChangeIndex]
            settings.population[toChangeIndex] = settings.population[i]
            settings.population[i] = aux
        }
    }

    function compete(){
        var nextGeneration = []
        
        for(let i = 0; i < settings.population.length - 1; i += 2){
            let phenotype = settings.population[i]
            let competitor = settings.population[i+1]

            nextGeneration.push(phenotype)
            if(doesABeatB(phenotype, competitor)){
                if(Math.random() < settings.mutationPercent){
                    nextGeneration.push(mutate(phenotype))
                } else {
                    nextGeneration.push(crossover(phenotype))
                }
            }else{
                nextGeneration.push(competitor)
            }
        }

        settings.population = nextGeneration
    }

    function mutate(phenotype){
        return settings.mutationFunction(cloneJson(phenotype))
    }

    function crossover(phenotype){
        const phenotypes = settings.crossoverFunction(cloneJson(phenotype), randomPhenotype())
        return phenotypes[randomInteger(phenotypes.length)]
    }

    function doesABeatB(phenotypeA, phenotypeB){
        if(settings.doesABeatBFunction){
            return settings.doesABeatBFunction(phenotypeA, phenotypeB)
        }
        return settings.fitnessFunction(phenotypeA) >= settings.fitnessFunction(phenotypeB)
    }

    function randomPhenotype(){
        return cloneJson(settings.population[randomInteger(settings.population.length)])
    }

    return {
        evolve: function(newOptions){
            if(newOptions){
                settings = settingsWithDefaults(newOptions, settings)
            }
            populate()
            randomizePopulationOrder()
            compete()
            return this
        },
        bestPhenotype: function(){
            let bestPhenotype = this.scoredPopulation().reduce(
                (a, b) => {
                    return a.score >= b.score ? a : b
                }, scoredPopulation[0]
            ).phenotype
            return cloneJson(bestPhenotype)
        },
        bestPhenotypeScore: function(){
            return settings.fitnessFunction(this.bestPhenotype())
        },
        elitePhenotypes: function(){
            return this.scoredPopulation()
                .sort((a, b) => b.score - a.score)
                .map((a) => a.phenotype)
                .slice(0, settings.elite)
        },
        population: function(){
            return cloneJson(this.config().population)
        },
        scoredPopulation: function(){
            return this.population().map((phenotype) => {
                return {
                    phenotype: cloneJson(phenotype),
                    score: settings.fitnessFunction(phenotype)
                }
            })
        },
        clone: (options) => {
            return createGenetic(settingsWithDefaults(
                options, this.config()
            ))
        },
        config: function(){
            return cloneJson(settings)
        },
        randomPhenotype
    }
}
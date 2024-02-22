import gameEvents from "./game_events.js"

export default function createGame(){
    const observers = []
    const state = {
        dinosaurs: {},
        cactus: {}
    }
    
    function addListener(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function dinoJump(command){
        const dinosaur = command.dinosaur

        if(dinosaur){
            if(state.dinosaurs[dinosaur]){
                state.dinosaurs[dinosaur].jumping = true

                notifyAll({
                    type: gameEvents.server2client.dinoJump,
                    dinosaur: command.dinosaur
                })
            }
        }
    }

    function dinoDie(command){
        const dinosaur = command.dinosaur

        if(dinosaur){
            // TODO:

            notifyAll({
                type: gameEvents.server2client.dinoDie,
                dinosaur: command.dinosaur
            })
        }
    }

    function setDinos(command){
        if(dinosaurs){
            // TODO:

            notifyAll({
                type: gameEvents.server2client.dinoDie,
                dinosaurs: command.dinosaur
            })
        }
    }

    return {
        setState,
        addListener,
        
        dinoJump,
        dinoDie,
        setDinos,

        state
    }
}
import gameEvents from "./game_events.js"

export default function createGame(){
    const observers = []
    const state = {
        running: false,
        dinosaurs: {},
        cactus: {}
    }

    function start(){
        state = {
            running: true,
            dinosaurs: {},
            cactus: {}
        }

        setInterval(() => {
            // TODO: logic
        }, 50)

        notifyAll({
            type: gameEvents.server2client.setup,
            state: state
        })
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
                type: gameEvents.server2client.setDinos,
                dinosaurs: command.dinosaur
            })
        }
    }

    function updateCactus(command){
        const cactus = command.cactus

        if(cactus){
            state.cactus = cactus

            notifyAll({
                type: gameEvents.server2client.updateCactus,
                cactus: command.cactus
            })
        }
    }

    return {
        start,
        setState,
        addListener,
        
        dinoJump,
        dinoDie,
        setDinos,
        updateCactus,

        state
    }
}
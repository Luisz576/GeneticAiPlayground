const gameEvents = {
    client2server: {
        startDinos: 'start-dinos',
        stopDinos: 'stop-dinos'
    },
    server2client: {
        setup: 'setup',
        setDinos: 'set-dinos',
        dinoJump: 'dino-jump',
        dinoDie: 'dino-die',
        updateCactus: 'update-cactus'
    }
}

export default gameEvents
const gameEvents = {
    client2server: {
        startDinos: 'start-dinos',
        stopDinos: 'stop-dinos',
        saveDinos: 'save-dinos'
    },
    server2client: {
        setup: 'setup',
        setDinos: 'set-dinos',
        gameSpeedUpdate: 'game-speed-update',
        setGeneration: 'set-generation',
        dinoJump: 'dino-jump',
        dinoDie: 'dino-die',
        updateCactus: 'update-cactus',
        resetGame: 'reset-game'
    }
}

export default gameEvents
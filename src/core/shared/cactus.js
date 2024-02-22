const initialGameCactusPosition = 1600
const cactusSize = {
    normal: {
        width: 50,
        height: -80
    },
    tall: {
        width: 50,
        height: -140
    }
}

/**
 * 
 * 0 = false
 * 1 = true
 * 2 = random
 * @param {number} isTall 
 */
export default function createCactus(isTall = 0){
    isTall = isTall == 0 ? 0 : isTall == 1 ? 1 : Math.floor(Math.random() * 2)
    const body = isTall ? cactusSize.tall : cactusSize.normal
    return {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        x: initialGameCactusPosition + body.width,
        isTall: isTall,
        body: body
    }
}
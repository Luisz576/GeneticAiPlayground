/**
 * 
 * 0 = false
 * 1 = true
 * 2 = random
 * @param {number} isTall 
 */
const cactusSize = {
    normal: {
        width: 10,
        height: 10
    },
    tall: {
        width: 10,
        height: 15
    }
}

export default function createCactus(isTall = 0, x){
    isTall = isTall == 0 ? 0 : isTall == 1 ? 1 : Math.floor(Math.random() * 2)
    return {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        x: x,
        isTall: isTall,
        hitbox: isTall ? cactusSize.tall : cactusSize.normal
    }
}
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

export default function createCactus(isTall = 0){
    isTall = isTall == 0 ? 0 : isTall == 1 ? 1 : Math.floor(Math.random() * 2)
    const body = isTall ? cactusSize.tall : cactusSize.normal

    function canKill(x, y, width, height){
        const distanceCD = this.x - (x + width)
        // TODO: ajustar formula
        if(distanceCD <= 0 && distanceCD >= -width && (y + height) >= this.body.height){
            return true
        }
        return false
    }

    return {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        x: initialGameCactusPosition + body.width,
        isTall: isTall,
        body: body,
        canKill
    }
}
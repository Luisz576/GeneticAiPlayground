const cactusSize = [
    {
        width: 75,
        height: -120
    },
    {
        width: 75,
        height: -210
    },
    {
        width: 75,
        height: -300
    }
]

export default function createCactus(initialPosition, type = 0){
    const body = selectCactusBody(type)

    function selectCactusBody(type){
        if(type == 0){
            return cactusSize[Math.floor(Math.random() * cactusSize.length)]
        }else{
            return cactusSize[type - 1]
        }
    }

    function canKill(x, y, width, height){
        const distanceCD = this.x - (x + width)
        // TODO: ajustar formula
        if(distanceCD <= 0 && distanceCD >= -width){
            const targetFoot = (y + height)
            if(targetFoot >= this.body.height){
                return true
            }
        }
        return false
    }

    return {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        x: initialPosition + body.width,
        body: body,
        canKill
    }
}
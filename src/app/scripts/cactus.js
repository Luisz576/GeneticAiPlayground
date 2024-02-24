const cactusSize = [
    {
        width: 90,
        height: -180,
        sprite: ""
    },
    {
        width: 270,
        height: -180,
        sprite: ""
    },
    {
        width: 90,
        height: -260,
        sprite: ""
    },
    {
        width: 270,
        height: -260,
        sprite: ""
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
        if(distanceCD <= 0 && distanceCD >= -this.body.width){
            if(y >= this.body.height){
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
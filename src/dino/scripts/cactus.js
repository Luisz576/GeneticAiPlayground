const cactusSize = [
    {
        width: 90,
        height: -180
    },
    {
        width: 270,
        height: -180
    },
    {
        width: 90,
        height: -260
    },
    {
        width: 270,
        height: -260
    }
]

const cactusSkin = new Image()
cactusSkin.src = ""

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
        if(distanceCD <= 0 && x >= -this.body.width){
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
        skin: cactusSkin,
        canKill
    }
}
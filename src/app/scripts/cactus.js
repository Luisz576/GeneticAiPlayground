const initialGameCactusPosition = 1600
const cactusSize = [
    {
        width: 50,
        height: -80
    },
    {
        width: 50,
        height: -140
    },
    {
        width: 50,
        height: -200
    }
]

export default function createCactus(type = 0){
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
        if(distanceCD <= 0 && distanceCD >= -width && (y + height) >= this.body.height){
            return true
        }
        return false
    }

    return {
        id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
        x: initialGameCactusPosition + body.width,
        body: body,
        canKill
    }
}
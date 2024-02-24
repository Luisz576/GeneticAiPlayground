export default function iaLogic(player, canvas, info, phenotype){
    let dX = info.ball.position.x - player.position.x
    if(dX < 0) dX *= -1
    let dY = info.ball.position.y - player.position.y
    return phenotype.bdx * dX + phenotype.bdy * dY
}
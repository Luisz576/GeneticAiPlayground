export default function phenotypeComparer(phenotypeA, phenotypeB){
    return (
        phenotypeA.bdx == phenotypeB.bdx &&
        phenotypeA.bdy == phenotypeB.bdy
    )
}
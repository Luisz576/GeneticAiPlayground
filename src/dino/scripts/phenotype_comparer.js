export default function phenotypeComparer(phenotypeA, phenotypeB){
    return (
        phenotypeA.cd == phenotypeB.cd &&
        phenotypeA.ch == phenotypeB.ch &&
        phenotypeA.cw == phenotypeB.cw &&
        phenotypeA.gs == phenotypeB.gs //&&
        // phenotypeA.mptj == phenotypeB.mptj
    )
}
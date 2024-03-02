import run from "./s.js"

fetch(" ./data/diabetes_012_health_indicators_BRFSS2021.csv").then((res) => {
    res.text().then((r) => {
        const csv = d3.csvParse(r)
        run(csv)
    })
}).catch((e) => console.error(e))
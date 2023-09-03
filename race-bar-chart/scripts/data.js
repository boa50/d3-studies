import { n, k } from "./constants.js"

export const prepareData = data => {
    const companies = new Set(data.map(d => d.name))
    
    const dateValues = Array.from(d3.rollup(data, ([d]) => +d.value, d => d.date, d => d.name))
            .map(([date, data]) => [new Date(date), data])
            .sort(([a], [b]) => d3.ascending(a, b))
    
    const rank = getValue => {
        const data = Array.from(companies, company => ({ company, value: getValue(company) }))
        data.sort((a, b) => d3.descending(a.value, b.value))
        for (let i = 0; i < data.length; i++) data[i].rank = Math.min(n, i)
    
        return data
    }
    
    const getKeyframes = () => {
        const keyframes = []
        let ka, a, kb, b
    
        for ([[ka, a], [kb, b]] of d3.pairs(dateValues)) {
            for (let i = 0; i < k; i++) {
                const t = i / k
                keyframes.push([
                    new Date(ka * (1 - t) + kb * t),
                    rank(company => (a.get(company) || 0) * (1 - t) + (b.get(company) || 0) * t)
                ])
            }
        }
    
        keyframes.push([new Date(kb), rank(company => b.get(company) || 0)])
        return keyframes
    }
    
    const keyframes = getKeyframes()
    
    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.company)
    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))

    return {keyframes, prev, next}
}

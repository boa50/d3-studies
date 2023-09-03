import { margin, width, barSize, n } from "./constants.js"

export const x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right])

export const y = d3
    .scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)

export const getRank = (mapping, d) => (mapping.get(d) || d).rank
export const getValue = (mapping, d) => (mapping.get(d) || d).value
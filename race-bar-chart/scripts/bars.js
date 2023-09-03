import { n } from "./constants.js"
import { getValue, getRank, x, y } from "./aux.js"

const colour = (data, d) => {
    const scale = d3.scaleOrdinal(d3.schemeTableau10)

    // In case there is some category in the dataset
    // the colours will be defined by it
    if (data.some(d => d.category !== undefined)) {
        const categoryByName = new Map(data.map(d => [d.name, d.category]))
        scale.domain(Array.from(categoryByName.values()))
        return scale(categoryByName.get(d.company))
    }

    return scale(d.company)
}

export const bars = (svg, rawData, prev, next) => {
    let bar = svg
        .append('g')
        .attr('fill-opacity', 0.6)
        .selectAll('rect')

    return ([date, data], transition) => bar = bar
        .data(data.slice(0, n), d => d.company)
        .join(
            enter => enter
                .append('rect')
                .attr('fill', d => colour(rawData, d))
                .attr('height', y.bandwidth())
                .attr('x', x(0))
                .attr('y', d => y(getRank(prev, d)))
                .attr('width', d => x(getValue(prev, d)) - x(0)),
            update => update,
            exit => exit
                .transition(transition)
                .remove()
                .attr('y', d => y(getRank(next, d)))
                .attr('width', d => x(getValue(next, d)) - x(0))
        )
        .call(
            bar => bar
                .transition(transition)
                .attr('y', d => y(d.rank))
                .attr('width', d => x(d.value) - x(0))
        )
}
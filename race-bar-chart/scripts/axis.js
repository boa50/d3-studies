import { margin, width, barSize, n } from "./constants.js"
import { x, y } from "./aux.js"

export const axis = svg => {
    const g = svg
        .append('g')
        .attr('transform', `translate(0, ${margin.top})`)

    const axis = d3
        .axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()))

    return (_, transition) => {
        g.transition(transition).call(axis)
        g.select('.tick:first-of-type text').remove()
        g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'line')
        g.select('.domain').remove()
    }
}
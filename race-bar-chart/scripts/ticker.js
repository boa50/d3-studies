import { barSize, width, margin, n } from "./constants.js"

const formatDate = d3.utcFormat('%Y')

export const ticker = (svg, keyframes) => {
    const now = svg
        .append('text')
        // .style('font', `bold ${barSize}px var(--sans-serif)`)
        // .style('font-variant-numeric', 'tabular-nums')
        .attr('font-weight', 'bold')
        .attr('font-size', barSize)
        .attr('text-anchor', 'end')
        .attr('x', width - 6)
        .attr('y', margin.top + barSize * (n - 0.45))
        .attr('dy', '0.32em')
        .text(formatDate(keyframes[0][0]))

    return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)))
    }
}
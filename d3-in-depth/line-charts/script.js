const WIDTH = 600
const HEIGHT = 250

const getSvg = (number, title = '') => {
    d3
        .select('#wrapper')
        .append('div')
        .attr('id', `chart${number}`)
        .classed('chart-container', true)
        .append('h4')
        .text(title)

    const svg = d3
        .select(`#chart${number}`)
        .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    return svg
}
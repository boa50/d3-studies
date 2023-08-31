let data3 = []

const updateData3 = () => {
    data3 = []
    for (let i = 0; i <= Math.ceil(randomNumber(10)); i++) {
        data3.push({
            x: randomNumber(WIDTH),
            r: randomNumber(40),
            fill: d3.rgb(randomNumber(255), randomNumber(255), randomNumber(255))
        })
    }
}

const updateChart3 = () => {
    const svg = d3
        .select('#chart3')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    svg
        .selectAll('circle')
        .data(data3)
        .join(
            enter => {
                enter
                    .append('circle')
                    .attr('cy', HEIGHT / 2)
                    .attr('cx', d => d.x)
                    .attr('r', 40)
                    .attr('fill', 'steelblue')
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 0.5)
            },
            update => update,
            exit => {
                exit
                    .transition()
                    .duration(1000)
                    .attr('cy', 500)
                    .remove()
            }
        )
        .transition()
        .duration(1000)
        .attr('cx', d => d.x)
}

const updateAll3 = () => {
    updateData3()
    updateChart3()
}

updateAll3()
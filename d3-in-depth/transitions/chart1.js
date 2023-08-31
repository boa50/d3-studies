let data1 = []

const randomNumber = limit => Math.floor(Math.random() * limit)

const updateData1 = () => {
    data1 = []
    for (let i = 0; i < 5; i++) {
        data1.push({
            x: randomNumber(WIDTH),
            r: randomNumber(40),
            fill: d3.rgb(randomNumber(255), randomNumber(255), randomNumber(255))
        })
    }
}

const updateChart1 = () => {
    const svg = d3
        .select('#chart1')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    svg
        .selectAll('circle')
        .data(data1)
        .join('circle')
        .attr('cy', 50)
        .style('opacity', 0.5)
        .transition()
        .delay((d, i) => 500 * i)
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('cx', d => d.x)
        .transition()
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr('r', d => d.r)
        .attr('fill', d => d.fill)

}

const updateAll1 = () => {
    updateData1()
    updateChart1()
}

updateAll1()
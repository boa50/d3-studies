const chart2 = () => {
    const data = { a: 9, b: 20, c: 30, d: 8, e: 12 }
    const svg = getSvg(2, 'Basic donut chart')

    const radius = Math.min(WIDTH, HEIGHT) / 2

    const colours = d3
        .scaleOrdinal()
        .range(d3.schemeTableau10)

    const pie = d3
        .pie()
        .value(d => d[1])
    const data_ready = pie(Object.entries(data))

    const arcGenerator = d3
        .arc()
        .innerRadius(70)
        .outerRadius(radius)
        .padAngle(.02)
        .cornerRadius(2)

    svg
        .append('g')
        .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)
        .selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => colours(d.data[1]))
        .style('opacity', 0.7)
}

chart2()
const chart4 = () => {
    const data = { a: 9, b: 20, c: 30, d: 8, e: 12 }
    const svg = getSvg(4, 'Donut chart with labels')
        .append('g')
        .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)

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
        .innerRadius(50)
        .outerRadius(radius * 0.8)
        .padAngle(.02)
        .cornerRadius(2)

    const labelsArc = d3
        .arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    svg
        .selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => colours(d.data[1]))
        .style('opacity', 0.7)

    const getMidAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2
    
    // Adding the lines to connect with the labels
    svg
        .selectAll('whatever')
        .data(data_ready)
        .join('polyline')
        .attr('stroke', '#555555')
        .style('fill', 'none')
        .attr('points', d => {
            const posA = arcGenerator.centroid(d)
            const posB = labelsArc.centroid(d)
            const posC = labelsArc.centroid(d)
            const midangle = getMidAngle(d)
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1)
            return [posA, posB, posC]
        })

    // Adding the labels
    svg
        .selectAll('whatever')
        .data(data_ready)
        .join('text')
        .text(d => d.data[0])
        .attr('fill', '#555555')
        .attr('transform', d => {
            const pos = labelsArc.centroid(d)
            const midangle = getMidAngle(d)
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1)
            return `translate(${pos})`
        })
        .style('text-anchor', d => {
            const midangle = getMidAngle(d)
            return midangle < Math.PI ? 'start' : 'end'
        })
}

chart4()
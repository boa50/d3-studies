const chart4 = () => {
    const data = {
        "name": "A1",
        "children": [
            {
                "name": "B1",
                "children": [
                    { "name": "C1", "value": 100 },
                    { "name": "C2", "value": 300 },
                    { "name": "C3", "value": 200 }
                ]
            },
            { "name": "B2", "value": 200 }
        ]
    }

    const svg = getSvg(4, 'Sunburst')
        .append('g')
        .attr('transform', `translate(${[WIDTH / 2, HEIGHT / 2]})`)

    const radius = Math.min(HEIGHT, WIDTH) / 2

    const partitionLayout = d3
        .partition()
        .size([2 * Math.PI, radius])

    const arcGenerator = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1)

    const root = d3.hierarchy(data)
    root.sum(d => d.value)

    partitionLayout(root)

    const colour = d3
        .scaleOrdinal()
        .domain(['B1', 'B2'])
        .range(d3.schemeTableau10)

    const opacity = d3
        .scaleLinear()
        .domain([2, 0])
        .range([.4, .8])

    svg
        .selectAll('path')
        .data(root.descendants().splice(1))
        .join('path')
        .attr('d', arcGenerator)
        .style('fill', d => colour(d.depth === 1 ? d.data.name : d.parent.data.name))
        .style('opacity', d => opacity(d.depth))
        .style('stroke', 'white')
}

chart4()
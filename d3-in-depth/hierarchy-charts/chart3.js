const chart3 = () => {
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

    const svg = getSvg(3, 'Circular Pack')
        .append('g')
        .attr('transform', `translate(${WIDTH / 2},0)`)

    const packLayout = d3
        .pack()
        .size([Math.min(HEIGHT, WIDTH), Math.min(HEIGHT, WIDTH)])

    const root = d3.hierarchy(data)
    root.sum(d => d.value)
    packLayout(root)

    const nodes = svg
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${[d.x, d.y]})`)

    nodes
        .append('circle')
        .attr('r', d => d.r)
        .style('fill', 'steelblue')
        .style('opacity', 0.3)
        .style('stroke', 'white')

    nodes
        .append('text')
        .attr('dy', 4)
        .text(d => d.children === undefined ? d.data.name : '')
        .style('fill', '#333')
        .style('font-size', '14px')
        .style('text-anchor', 'middle')
}

chart3()
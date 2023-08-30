const chart1 = () => {
    const getData = async () =>
        d3.json('./dataset1.json')

    const svg = getSvg(1, 'Dendrogram')
        .append('g')
        .attr('transform', 'translate(50,0)')

    const linkNodes = d => 
        `M${d.y},${d.x}C${d.parent.y + 50},${d.x} ${d.parent.y + 150},${d.parent.x} ${d.parent.y},${d.parent.x}`

    getData().then(data => {
        const cluster = d3
            .cluster()
            .size([HEIGHT, WIDTH - 100])

        const root = d3.hierarchy(data)

        cluster(root)

        // Adding the links between nodes
        svg
            .selectAll('path')
            .data(root.descendants().slice(1))
            .join('path')
            .attr('d', linkNodes)
            .style('fill', 'none')
            .attr('stroke', '#ccc')

        // Adding circles for the nodes
        svg
            .selectAll('g')
            .data(root.descendants())
            .join('g')
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .append('circle')
            .attr('r', 7)
            .style('fill', 'steelblue')
            .attr('stroke', '#777')
            .style('stroke-width', 2)
    })
}

chart1()
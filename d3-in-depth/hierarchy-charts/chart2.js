const chart2 = () => {
    const getData = async () =>
        d3.json('./dataset2.json')

    const svg = getSvg(2, 'Treemap')

    getData().then(data => {
        const root = d3
            .hierarchy(data)
            .sum(d => d.value)

        d3
            .treemap()
            .size([WIDTH, HEIGHT])
            .paddingTop(28)
            .paddingRight(7)
            .paddingInner(3)
            // .paddingOuter(20)
            (root)

        const colour = d3
            .scaleOrdinal()
            .domain(["boss1", "boss2", "boss3"])
            .range(d3.schemeTableau10)

        const opacity = d3
            .scaleLinear()
            .domain([10, 30])
            .range([.5, 1])

        svg
            .selectAll('rect')
            .data(root.leaves())
            .join('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('stroke', '#555')
            .style('fill', d => colour(d.parent.data.name))
            .style('opacity', d => opacity(d.data.value))

        svg
            .selectAll('text')
            .data(root.leaves())
            .join('text')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 20)
            .text(d => d.data.name.replace('mister_', ''))
            .attr('font-size', '19px')
            .attr('fill', 'white')

        svg
            .selectAll('vals')
            .data(root.leaves())
            .join('text')
            .attr('x', d => d.x0 + 5)
            .attr('y', d => d.y0 + 35)
            .text(d => d.data.value)
            .attr('font-size', '11px')
            .attr('fill', 'white')

        svg
            .selectAll('titles')
            .data(root.descendants().filter(d => d.depth === 1))
            .join('text')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0 + 20)
            .text(d => d.data.name)
            .attr('font-size', '19px')
            .attr('fill', d => colour(d.data.name))

        svg
            .append('text')
            .attr('x', 0)
            .attr('y', 14)
            .text('Some title for the chart')
            .attr('font-size', 19)
            .attr('fill', '#555')
    })
}

chart2()
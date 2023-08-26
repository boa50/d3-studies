const chart4 = () => {
    getData = async () => await d3.csv('./dataset1.csv')

    const svg = getSvg(4, 'Basic stacked with highlighting')

    // Highlighting functions
    const mouseover = function () {
        const subgroupName = d3.select(this.parentNode).datum().key

        d3
            .selectAll('.customRect')
            .style('opacity', 0.2)

        d3
            .selectAll('.' + subgroupName)
            .style('opacity', 1)
    }

    const mouseleave = function () {
        d3
            .selectAll('.customRect')
            .style('opacity', 1)
    }

    getData().then(data => {
        const groups = d3.map(data, d => d.group)
        const subgroups = data.columns.slice(1)

        xScale = d3
            .scaleBand()
            .domain(groups)
            .range([20, WIDTH])
            .padding([0.2])
        svg.append('g')
            .attr('transform', `translate(0, ${HEIGHT - 20})`)
            .call(d3.axisBottom(xScale).tickSizeOuter(0))

        yScale = d3
            .scaleLinear()
            .domain([0, 60])
            .range([HEIGHT - 20, 0])
        svg.append('g')
            .attr('transform', `translate(20, 0)`)
            .call(d3.axisLeft(yScale));

        const colours = d3
            .scaleOrdinal()
            .domain(subgroups)
            .range(d3.schemeTableau10)

        const stackedData = d3
            .stack()
            .keys(subgroups)
            (data)

        svg
            .selectAll('.group')
            .data(stackedData)
            .join('g')
            .attr('fill', d => colours(d.key))
            .attr('class', d => 'customRect ' + d.key)
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => xScale(d.data.group))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .on('mouseover', mouseover)
            .on('mouseleave', mouseleave)
    })
}

chart4()
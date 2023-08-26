const chart3 = () => {
    getData = async () => await d3.csv('./dataset1.csv')

    const svg = getSvg(3, 'Basic stacked with tooltip')

    const tooltip = d3.select('#chart3')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('position', 'absolute')

    const mouseover = function (event, d) {
        const subgroupName = d3.select(this.parentNode).datum().key;
        const subgroupValue = d.data[subgroupName];
        tooltip
            .html(`Subgroup: ${subgroupName}<br>Value: ${subgroupValue}`)
            .style('opacity', 1)

    }
    const mousemove = function (event, d) {
        tooltip
            .style('left', `${event.x}px`)
            .style('top', `${event.y + 170}px`)
    }
    const mouseleave = function (event, d) {
        tooltip
            .style('opacity', 0)
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
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => xScale(d.data.group))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
    })
}

chart3()
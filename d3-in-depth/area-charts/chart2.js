const chart2 = () => {
    const getData = async () =>
        await d3.csv('./dataset2.csv')

    const svg = getSvg(2, 'Stacked from long input')

    getData().then(data => {
        const sumstat = d3.group(data, d => d.year)
        const groups = [... new Set(d3.map(data, d => d.name))]
        const keys = [...Array(groups.length + 1).keys()].slice(1)

        const stackedData = d3
            .stack()
            .keys(keys)
            .value((d, key) => d[1][key] !== undefined ? d[1][key].n : 0)
            (sumstat)

        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([40, WIDTH])
        svg.append('g')
            .attr('transform', `translate(0, ${HEIGHT - 20})`)
            .call(d3.axisBottom(xScale).ticks(5))

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => +d.n) * 1.5])
            .range([HEIGHT - 20, 0])
        svg.append('g')
            .attr('transform', `translate(40, 0)`)
            .call(d3.axisLeft(yScale));

        const colours = d3
            .scaleOrdinal()
            .domain(groups)
            .range(d3.schemeTableau10)

        const areaGenerator = d3
            .area()
            .x(d => xScale(d.data[0]))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))

        svg
            .selectAll('mylayers')
            .data(stackedData)
            .join('path')
            .style('fill', d => colours(groups[d.key - 1]))
            // .attr('stroke', '#69b3a2')
            // .attr('stroke-width', 1.5)
            .attr('d', areaGenerator)
    })
}

chart2()
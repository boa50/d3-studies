const chart3 = () => {
    const getData = async () =>
        await d3.csv('./dataset3.csv')

    const svg = getSvg(3, 'Stacked from wide input')

    getData().then(data => {
        const groups = data.columns.slice(1)

        const stackedData = d3
            .stack()
            .keys(groups)
            .order(d3.stackOrderDescending)
            (data)

        console.log(stackedData);

        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([50, WIDTH])
        svg.append('g')
            .attr('transform', `translate(0, ${HEIGHT - 20})`)
            .call(d3.axisBottom(xScale).ticks(5))

        const yScale = d3
            .scaleLinear()
            .domain([0, 200000])
            .range([HEIGHT - 20, 0])
        svg.append('g')
            .attr('transform', `translate(50, 0)`)
            .call(d3.axisLeft(yScale));

        const colours = d3
            .scaleOrdinal()
            .domain(groups)
            .range(d3.schemeTableau10)

        const areaGenerator = d3
            .area()
            .x(d => xScale(d.data.year))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))

        svg
            .selectAll('mylayers')
            .data(stackedData)
            .join('path')
            .style('fill', d => colours(d.key))
            .attr('d', areaGenerator)
    })
}

chart3()
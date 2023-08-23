const chart4 = () => {
    getData = async () =>
        await d3.csv('./dataset2.csv',
            d => {
                return {
                    year: d.year,
                    name: d.name,
                    value: +d.n
                }
            }
        )

    const svg = getSvg(4, 'Multi lines')

    getData().then(data => {
        const groupedData = d3
            .nest()
            .key(d => d.name)
            .entries(data)

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0, WIDTH])
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([HEIGHT, 0])

        // Colour palette
        const names = groupedData.map(d => d.key)
        const colours = d3
            .scaleOrdinal()
            .domain(names)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

        const lineGenerator = d3
            .line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.value))
            .curve(d3.curveBasis)

        svg
            .selectAll('.line')
            .data(groupedData)
            .enter()
            .append('path')
            .attr('stroke', d => colours(d.key))
            .attr('d', d => lineGenerator(d.values))
    })
}

chart4()
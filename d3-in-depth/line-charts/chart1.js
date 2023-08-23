const chart1 = () => {
    getData = async () =>
        await d3.csv('./dataset1.csv',
            d => {
                return {
                    date: d3.timeParse('%Y-%m-%d')(d.date),
                    value: +d.value
                }
            }
        )

    const svg = getSvg(1, 'Simple line')

    getData().then(data => {
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, WIDTH])
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([HEIGHT, 0])

        const lineGenerator = d3
            .line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))

        svg
            .append('path')
            .datum(data)
            .attr('stroke', 'steelblue')
            .attr('d', lineGenerator)
    })
}

chart1()
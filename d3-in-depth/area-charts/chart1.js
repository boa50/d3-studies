const chart1 = () => {
    const getData = async () =>
        await d3.csv('./dataset1.csv',
            d => {
                return {
                    date: d3.timeParse('%Y-%m-%d')(d.date),
                    value: +d.value
                }
            }
        )

    const svg = getSvg(1, 'Basic chart')

    getData().then(data => {
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([40, WIDTH])
        svg.append('g')
            .attr('transform', `translate(0, ${HEIGHT - 20})`)
            .call(d3.axisBottom(xScale).tickSizeOuter(0))

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([HEIGHT - 20, 0])
        svg.append("g")
            .attr('transform', `translate(40, 0)`)
            .call(d3.axisLeft(yScale));

        const areaGenerator = d3
            .area()
            .x(d => xScale(d.date))
            .y0(yScale(0))
            .y1(d => yScale(d.value))

        svg
            .append('path')
            .datum(data)
            .style('fill', '#cce5df')
            .attr('stroke', '#69b3a2')
            .attr('stroke-width', 1.5)
            .attr('d', areaGenerator)
    })
}

chart1()
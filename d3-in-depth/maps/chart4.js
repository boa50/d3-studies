const chart4 = () => {
    const getData = async () =>
        Promise.all([
            d3.json('./world.geojson'),
            d3.csv('./dataset3.csv')
        ])

    const svg = getSvg(4, 'Bubble map')


    const projection = d3
        .geoMercator()
        .scale(99)
        .center([0, 20])
        .translate([WIDTH / 2, HEIGHT / 2])
    const path = d3
        .geoPath()
        .projection(projection)

    getData().then(dataset => {
        const geo = dataset[0]
        const data = dataset[1]

        const colour = d3
            .scaleOrdinal()
            .domain(data.map(d => d.homecontinent))
            .range(d3.schemeTableau10)

        const bubbleSize = d3
            .scaleSqrt()
            .domain(d3.extent(data, d => +d.n))
            .range([1, 50])

        // Map
        svg
            .selectAll('path')
            .data(geo.features)
            .join('path')
            .attr('d', path)
            .attr('fill', '#B8B8B8')
            .style('opacity', 0.5)

        // Circles
        svg
            .selectAll('myCircles')
            // .data(data)
            .data(data.sort((a, b) => +b.n - +a.n).filter((_, i) => i < 1000))
            .join('circle')
            .attr('cx', d => projection([+d.homelon, +d.homelat])[0])
            .attr('cy', d => projection([+d.homelon, +d.homelat])[1])
            .attr('r', d => bubbleSize(+d.n))
            .style('fill', d => colour(d.homecontinent))
            .attr('fill-opacity', 0.5)

        // ------ //
        // LEGEND //
        // ------ //

        const valuesToShow = [100, 4000, 15000]
        const xCircle = 40
        const xLabel = 90

        // Circles
        svg
            .selectAll('legend')
            .data(valuesToShow)
            .join('circle')
            .attr('cx', xCircle)
            .attr('cy', d => HEIGHT - bubbleSize(d))
            .attr('r', d => bubbleSize(d))
            .style('fill', 'none')
            .attr('stroke', 'black')

        // Segments
        svg
            .selectAll('legend')
            .data(valuesToShow)
            .join('line')
            .attr('x1', d => xCircle + bubbleSize(d))
            .attr('x2', xLabel)
            .attr('y1', d => HEIGHT - bubbleSize(d))
            .attr('y2', d => HEIGHT - bubbleSize(d))
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))

        // Labels
        svg
            .selectAll('legend')
            .data(valuesToShow)
            .join('text')
            .attr('x', xLabel)
            .attr('y', d => HEIGHT - bubbleSize(d))
            .text(d => d)
            .style('font-size', 10)
            .attr('alignment-baseline', 'middle')
    })
}

chart4()
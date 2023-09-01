const chart2 = () => {
    let data = new Map()
    const getData = async () =>
        Promise.all([
            d3.json('./world.geojson'),
            d3.csv('./dataset1.csv', d => { data.set(d.code, +d.pop) })
        ])

    const svg = getSvg(2, 'Choropleth map with hover effects')


    const projection = d3
        .geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([WIDTH / 2, HEIGHT / 2])
    const path = d3
        .geoPath()
        .projection(projection)

    const colour = d3
        .scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7])

    const mouseover = function (d) {
        d3
            .selectAll('.Country')
            .transition()
            .duration(200)
            .style('opacity', 0.5)
            .style('stroke', 'transparent')

        d3
            .select(this)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('stroke', 'black')
    }

    const mouseleave = function (d) {
        d3
            .selectAll('.Country')
            .transition()
            .duration(200)
            .style('opacity', 0.8)
            .style('stroke', 'transparent')
    }

    getData().then(dataset => {
        const geo = dataset[0]

        svg
            .selectAll('path')
            .data(geo.features)
            .join('path')
            .attr('d', path)
            .classed('Country', true)
            .attr('fill', d => colour(data.get(d.id) || 0))
            .style('stroke', 'transparent')
            .style('opacity', 0.8)
            .on('mouseover', mouseover)
            .on('mouseleave', mouseleave)
    })
}

chart2()
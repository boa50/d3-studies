const chart1 = () => {
    let data = new Map()
    const getData = async () =>
        Promise.all([
            d3.json('./world.geojson'),
            d3.csv('./dataset1.csv', d => { data.set(d.code, +d.pop) })
        ])

    const svg = getSvg(1, 'Basic choropleth map')


    const projection = d3
        // .geoMercator()
        .geoEquirectangular()
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

    getData().then(dataset => {
        const geo = dataset[0]

        svg
            .selectAll('path')
            .data(geo.features)
            .join('path')
            .attr('d', path)
            .attr('fill', d => colour(data.get(d.id) || 0))
    })
}

chart1()
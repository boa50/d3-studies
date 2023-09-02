const chart3 = () => {
    const getData = async () =>
        Promise.all([
            d3.json('./world.geojson'),
            d3.csv('./dataset2.csv')
        ])

    const svg = getSvg(3, 'Basic map with connections')


    const projection = d3
        .geoMercator()
        .scale(85)
        .center([0, 20])
        .translate([WIDTH / 2, HEIGHT / 2])
    const path = d3
        .geoPath()
        .projection(projection)

    getData().then(dataset => {
        const geo = dataset[0]
        const data = dataset[1]

        const links = []
        data.forEach(row => {
            source = [+row.long1, +row.lat1]
            target = [+row.long2, +row.lat2]
            topush = {type: 'LineString', coordinates: [source, target]}
            links.push(topush)
        })

        // Base map
        svg
            .selectAll('path')
            .data(geo.features)
            .join('path')
            .attr('d', path)
            .attr('fill', '#B8B8B8')
            .style('stroke', 'white')
            .style('stroke-width', 0.1)

        // Links
        svg
            .selectAll('myPath')
            .data(links)
            .join('path')
            .attr('d', d => path(d))
            .style('fill', 'none')
            .style('stroke', 'steelblue')
            .style('stroke-width', 2)
    })
}

chart3()
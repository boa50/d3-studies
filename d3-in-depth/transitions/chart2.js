let data2 = []
const majorRadius = 100

const updateData2 = () => {
    data2 = []
    for (let i = 0; i < 5; i ++) {
        data2.push(Math.random() * 2 * Math.PI)
    }
}

const getCurrentAngle = el => {
    const x = d3.select(el).attr('cx')
    const y = d3.select(el).attr('cy')
    return Math.atan2(y, x)
}

const updateChart2 = () => {
    const svg = d3
        .select('#chart2')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .select('g')
        .attr('transform', `translate(${WIDTH / 2}, ${HEIGHT / 2})`)

    svg
        .selectAll('circle')
        .data(data2)
        .join('circle')
        .attr('r', 7)
        .attr('fill', 'steelblue')
        .style('opacity', 0.7)
        .transition()
        .duration(1000)
        .tween('any-id', function (d) {
            const currentAngle = getCurrentAngle(this)
            let targetAngle = d

            // Ensure shortest path transition
            if (targetAngle - currentAngle > Math.PI) {
                targetAngle -= 2 * Math.PI
            } else if (targetAngle - currentAngle < Math.PI) {
                targetAngle += 2 * Math.PI
            }

            const interp = d3.interpolate(currentAngle, targetAngle)

            return function (t) {
                const angle = interp(t)

                d3
                    .select(this)
                    .attr('cx', majorRadius * Math.cos(angle))
                    .attr('cy', majorRadius * Math.sin(angle))
            }
        })
}

const updateAll2 = () => {
    updateData2()
    updateChart2()
}

updateAll2()
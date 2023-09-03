// Code based on https://observablehq.com/@d3/bar-chart-race-explained

const width = 600
const margin = ({ top: 16, right: 6, bottom: 6, left: 0 })
const barSize = 36
const n = 10
const height = margin.top + barSize * n + margin.bottom
const duration = 250
const k = 10

const getData = async () => d3.csv('./data.csv')

const x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right])

const y = d3
    .scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)

const formatNumber = d3.format(',d')
const formatDate = d3.utcFormat('%Y')

function textTween(a, b) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

const getRank = (mapping, d) => (mapping.get(d) || d).rank
const getValue = (mapping, d) => (mapping.get(d) || d).value


getData().then(data => {
    // DATA PREPARATION
    const companies = new Set(data.map(d => d.name))
    const dateValues = Array.from(d3.rollup(data, ([d]) => +d.value, d => d.date, d => d.name))
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => d3.ascending(a, b))

    const rank = getValue => {
        const data = Array.from(companies, company => ({ company, value: getValue(company) }))
        data.sort((a, b) => d3.descending(a.value, b.value))
        for (let i = 0; i < data.length; i++) data[i].rank = Math.min(n, i)

        return data
    }

    const getKeyframes = () => {
        const keyframes = []
        let ka, a, kb, b

        for ([[ka, a], [kb, b]] of d3.pairs(dateValues)) {
            for (let i = 0; i < k; i++) {
                const t = i / k
                keyframes.push([
                    new Date(ka * (1 - t) + kb * t),
                    rank(company => (a.get(company) || 0) * (1 - t) + (b.get(company) || 0) * t)
                ])
            }
        }

        keyframes.push([new Date(kb), rank(company => b.get(company) || 0)])
        return keyframes
    }

    const keyframes = getKeyframes()

    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.company)
    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))


    // PLOTTING
    const colour = d => {
        const scale = d3.scaleOrdinal(d3.schemeTableau10)

        // In case there is some category in the dataset
        // the colours will be defined by it
        if (data.some(d => d.category !== undefined)) {
            const categoryByName = new Map(data.map(d => [d.name, d.category]))
            scale.domain(Array.from(categoryByName.values()))
            return scale(categoryByName.get(d.company))
        }

        return scale(d.company)
    }

    const bars = svg => {
        let bar = svg
            .append('g')
            .attr('fill-opacity', 0.6)
            .selectAll('rect')

        return ([date, data], transition) => bar = bar
            .data(data.slice(0, n), d => d.company)
            .join(
                enter => enter
                    .append('rect')
                    .attr('fill', colour)
                    .attr('height', y.bandwidth())
                    .attr('x', x(0))
                    .attr('y', d => y(getRank(prev, d)))
                    .attr('width', d => x(getValue(prev, d)) - x(0)),
                update => update,
                exit => exit
                    .transition(transition)
                    .remove()
                    .attr('y', d => y(getRank(next, d)))
                    .attr('width', d => x(getValue(next, d)) - x(0))
            )
            .call(
                bar => bar
                    .transition(transition)
                    .attr('y', d => y(d.rank))
                    .attr('width', d => x(d.value) - x(0))
            )
    }

    const labels = svg => {
        let label = svg
            .append('g')
            // .style('font', `bold ${barSize}px var(--sans-serif)`)
            .attr('font-weight', 'bold')
            .attr('font-size', barSize / 2.5)
            // .style('font-variant-numeric', 'tabular-nums')
            .attr('text-anchor', 'end')
            .selectAll('text')

        return ([date, data], transition) => label = label
            .data(data.slice(0, n), d => d.company)
            .join(
                enter => enter
                    .append('text')
                    .attr('transform', d => `translate(${[x(getValue(prev, d)), y(getRank(prev, d))]})`)
                    .attr('y', y.bandwidth() / 2)
                    .attr('x', -6)
                    .attr('dy', '-0.25em')
                    .text(d => d.company)
                    .call(
                        text => text
                            .append('tspan')
                            .attr('fill-opacity', 0.7)
                            .attr('font-weight', 'normal')
                            .attr('x', -6)
                            .attr('dy', '1.15em')
                    ),
                update => update,
                exit => exit
                    .transition(transition)
                    .remove()
                    .attr('transform', d => `translate(${[x(getValue(next, d)), y(getRank(next, d))]})`)
                    .call(
                        g => g
                            .select('tspan')
                            .tween('text', d => textTween(d.value, getValue(next, d)))
                    )
            )
            .call(
                bar => bar
                    .transition(transition)
                    .attr('transform', d => `translate(${[x(d.value), y(d.rank)]})`)
                    .call(
                        g => g
                            .select('tspan')
                            .tween('text', d => textTween(getValue(prev, d), d.value))
                    )
            )
    }

    const axis = svg => {
        const g = svg
            .append('g')
            .attr('transform', `translate(0, ${margin.top})`)

        const axis = d3
            .axisTop(x)
            .ticks(width / 160)
            .tickSizeOuter(0)
            .tickSizeInner(-barSize * (n + y.padding()))

        return (_, transition) => {
            g.transition(transition).call(axis)
            g.select('.tick:first-of-type text').remove()
            g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'line')
            g.select('.domain').remove()
        }
    }

    const ticker = svg => {
        const now = svg
            .append('text')
            // .style('font', `bold ${barSize}px var(--sans-serif)`)
            // .style('font-variant-numeric', 'tabular-nums')
            .attr('font-weight', 'bold')
            .attr('font-size', barSize)
            .attr('text-anchor', 'end')
            .attr('x', width - 6)
            .attr('y', margin.top + barSize * (n - 0.45))
            .attr('dy', '0.32em')
            .text(formatDate(keyframes[0][0]))

        return ([date], transition) => {
            transition.end().then(() => now.text(formatDate(date)))
        }
    }


    const chart = async () => {
        const svg = d3
            .select("body")
            .append('svg')
            .attr("viewBox", [0, 0, width, height])
            .attr('width', width)
            .attr('height', height)

        const updateBars = bars(svg)
        const updateLabels = labels(svg)
        const updateAxis = axis(svg)
        const updateTicker = ticker(svg)

        for (const keyframe of keyframes) {
            const transition = svg
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)

            // Extract the top bar’s value
            x.domain([0, keyframe[1][0].value])

            updateBars(keyframe, transition)
            updateLabels(keyframe, transition)
            updateAxis(keyframe, transition)
            updateTicker(keyframe, transition)

            await transition.end()
        }
    }

    chart()
})
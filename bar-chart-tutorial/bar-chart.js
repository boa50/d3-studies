// Later these will be adjusted to make room
// for a vertical and horizontal axis.
const BOTTOM_PADDING = 50;
const LEFT_PADDING = 25;
const RIGHT_PADDING = 10;
const TOP_PADDING = 10;

// Full size of the svg element.
const HEIGHT = 300;
const WIDTH = 400;

// Size that can be used for the bars.
const usableHeight = HEIGHT - TOP_PADDING - BOTTOM_PADDING;
const usableWidth = WIDTH - LEFT_PADDING - RIGHT_PADDING;

// Random data will be selected from this array.
const allData = [
    { name: 'apple', colorIndex: 1 },
    { name: 'banana', colorIndex: 2 },
    { name: 'cherry', colorIndex: 3 },
    { name: 'date', colorIndex: 4 },
    { name: 'grape', colorIndex: 5 },
    { name: 'mango', colorIndex: 6 },
    { name: 'peach', colorIndex: 7 },
    { name: 'raspberry', colorIndex: 8 },
    { name: 'strawberry', colorIndex: 9 },
    { name: 'tangerine', colorIndex: 10 },
    { name: 'watermelon', colorIndex: 11 }
];

let barPadding, barWidth, xAxisGroup, xScale, yAxisGroup, yScale;

const DURATION = 500
const myTransition = selection =>
    selection.transition().duration(DURATION)

const colorScale = d3.scaleOrdinal(d3.schemePaired)

const random = max => Math.floor(Math.random() * max + 1)

const getRandomData = () => {
    const count = random(allData.length)
    const shuffled = allData.sort(() => 0.5 - Math.random())
    const data = shuffled.slice(0, count)
    data.sort((f1, f2) => f1.name.localeCompare(f2.name))
    for (const item of data) {
        item.score = random(10)
    }

    return data
}

const updateRect = rect => {
    myTransition(rect)
        .attr('x', barPadding)
        .attr('y', d => TOP_PADDING + yScale(d.score))
        .attr('width', barWidth - barPadding * 2)
        .attr('height', d => usableHeight - yScale(d.score))
        .attr('fill', d => colorScale(d.colorIndex))
}

const updateYAxis = (svg, max) => {
    if (!yAxisGroup) {
        yAxisGroup = svg
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${LEFT_PADDING}, ${TOP_PADDING})`)
    }

    const tickValues = Array.from(Array(max + 1).keys())

    const yAxis = d3
        .axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat(n => n.toFixed(0))

    yAxis(yAxisGroup)
    // It's the same as yAxisGroup.call(yAxis)

    yAxisGroup = myTransition(yAxisGroup)
}

const updateXAxis = (svg, data) => {
    if (!xAxisGroup) {
        xAxisGroup = svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${TOP_PADDING + usableHeight})`)
    }

    const xAxisScale = d3
        .scaleBand()
        .domain(data.map(item => item.name))
        .range([LEFT_PADDING, LEFT_PADDING + usableWidth])

    const xAxis = d3
        .axisBottom(xAxisScale)
        .ticks(data.length)

    xAxis(xAxisGroup)

    xAxisGroup = myTransition(xAxisGroup)
}

// This returns a text color to use on a given background color.
function getTextColor(bgColor) {
    // Convert the hex background color to its decimal components.
    const red = parseInt(bgColor.substring(1, 3), 16);
    const green = parseInt(bgColor.substring(3, 5), 16);
    const blue = parseInt(bgColor.substring(5, 7), 16);

    // Compute the "relative luminance".
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

    // Use dark text on light backgrounds and vice versa.
    return luminance > 0.5 ? 'black' : 'white';
}

const updateText = text => {
    myTransition(text)
        .attr('fill', d => getTextColor(colorScale(d.colorIndex)))
        .text(d => d.score)
        .attr('x', barWidth / 2)
        .attr('y', d => TOP_PADDING + yScale(d.score) + 20)
}

const updateData = () => {
    const data = getRandomData()

    barPadding = Math.ceil(30 / data.length)
    barWidth = usableWidth / data.length

    xScale = d3
        .scaleLinear()
        .domain([0, data.length])
        .range([LEFT_PADDING, LEFT_PADDING + usableWidth])

    const max = d3.max(data, d => d.score)

    yScale = d3
        .scaleLinear()
        .domain([0, max])
        .range([usableHeight, 0])

    const svg = d3
        .select('#chart')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    const groups = svg
        .selectAll('.bar')
        .data(data, d => d.name)
        .join(enter => {
            const groups = enter
                .append('g')
                .attr('class', 'bar')

            groups
                .append('rect')
                .attr('y', TOP_PADDING - usableHeight)
                .attr('height', 0)

            groups
                .append('text')
                .attr('y', TOP_PADDING + usableHeight)

            return groups
        },
            update => update,
            exit => {
                exit.selectAll('text').remove()

                myTransition(exit)
                    .select('rect')
                    .attr('height')
                    .attr('y', TOP_PADDING + usableHeight)
                    .on('end', () => exit.remove())
            })

    groups.attr('transform', (_, i) => `translate(${xScale(i)}, 0)`)

    updateRect(groups.select('rect'))
    updateText(groups.select('text'))
    updateXAxis(svg, data)
    updateYAxis(svg, max)
}

updateData()
// Code based on https://observablehq.com/@d3/bar-chart-race-explained
import { width, height, duration } from "./constants.js"
import { x } from "./aux.js"
import { prepareData } from "./data.js"
import { bars } from "./bars.js"
import { labels } from "./labels.js"
import { axis } from "./axis.js"
import { ticker } from "./ticker.js"

const getData = async () => d3.csv('./data.csv')

getData().then(data => {
    const { keyframes, prev, next } = prepareData(data)

    const chart = async () => {
        const svg = d3
            .select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        const updateBars = bars(svg, data, prev, next)
        const updateLabels = labels(svg, prev, next)
        const updateAxis = axis(svg)
        const updateTicker = ticker(svg, keyframes)

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
/* eslint no-unused-vars: "off" */
/**
 * This is an experiment to see if I can recreate funfunfunctions machine-learning / back-propagation code
 * @link https://www.youtube.com/watch?v=anN2Ey37s-o
 *
 * Step 1 is to recreate the JS code
 * Step 2 is to port to ReasonML
 * @return object
 */
const fff = (() => {
  "use strict"
  const X_MAX = 400
  const Y_MAX = 400
  const EXAMPLE_COUNT = 100000
  const gym = () => {
    const rand = (high, low) => Math.random() * (high - low) + low
    const points = length => Array(length).fill().map(() => ({
      x: rand(0, X_MAX),
      y: rand(0, Y_MAX)
    }))
    const weights = {
      x: rand(-1, 1),
      y: rand(-1, 1)
    }
    const classifier = (output) => output > 0 ? 1 : 0
    const dot = (a, b) => a.x * b.x + a.y * b.y
    const prediction = (weights, point) => classifier(dot(weights, point))
    // const prediction = (weight, point) => classifier(team(point))
    const team = point => point.x > point.y ? 1 : 0
    const train = (weights, point, actual) => {
      const predict = prediction(weights, point)
      const error = actual - predict
      return {
        x: weights.x + (point.x * error),
        y: weights.y + (point.y * error)
      }
    }
    const examples = points(EXAMPLE_COUNT).map(
      point => ({point, actual: team(point)})
    )
    return {
      examples,
      train,
      weights,
      points,
      prediction
    }
  }

  const chartGym = gym()
  const chart = prediction => {
    const el = name => document.createElementNS(
      "http://www.w3.org/2000/svg",
      name
    )
    const colours = ["red", "blue"]
    const circle = (point, colour, radius) => {
      let c = el("circle")
      c.setAttribute("cx", point.x)
      c.setAttribute("cy", point.y)
      c.setAttribute("r", radius)
      c.style.fill = colour
      return c
    }
    const clickcircle = c => {
      c.onclick = e => console.log(e.target.attributes)
      return c
    }

    let line = (start, end, colour) => {
      let l = el("line")
      l.setAttribute("x1", start.x)
      l.setAttribute("y1", start.y)
      l.setAttribute("x2", end.x)
      l.setAttribute("y2", end.y)
      l.setAttribute("stroke", colour)
      return l
    }

    let svg = () => {
      let svg = el("svg")
      svg.setAttribute("height", Y_MAX)
      svg.setAttribute("width", X_MAX)
      return svg
    }

    const trainedWeights = chartGym.examples.reduce(
      (acc, example) => chartGym.train(acc, example.point, example.actual),
      chartGym.weights
    )
    console.log(trainedWeights)

    const fill = svg => {
      const graphPoints = chartGym.points(200)
      graphPoints.map(point => svg.appendChild(
        // circle(point, colours[prediction({x:-1,y:1}, point)], 5)
        clickcircle(circle(point, colours[prediction(trainedWeights, point)], 5))
      ))
      graphPoints.map(point => svg.appendChild(
        circle(point, "white", 1)
      ))
      svg.appendChild(line({x: 0, y: 0}, {x: X_MAX, y: Y_MAX}, "gray"))
      return svg
    }

    return fill(svg())
  }

  document.getElementById("root").appendChild(chart(chartGym.prediction))

  return {
    chartGym
  }
})()

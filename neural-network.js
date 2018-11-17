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
  /**
   * Generate the required data specific for this network
   *
   * @returns {object} {weights,points} the initial weights and training/test data
   */
  const generator = () => {
    /**
     * Generate random number between min and max
     *
     * @param   {float} min
     * @param   {float} max
     * @returns {float} Random number
     */
    const rand = (min, max) => Math.random() * (max - min) + min
    // random set of data points
    const points = length => Array(length).fill().map(() => ({
      x: rand(0, X_MAX),
      y: rand(0, Y_MAX)
    }))
    // initial random weights
    const weights = {
      x: rand(-1, 1),
      y: rand(-1, 1)
    }
    // we happen to know that this will classify out points correctly
    // so we can use it to generate actual values for training examples
    const team = point => point.x > point.y ? 1 : 0
    const labeller = examples => examples.map(
      point => ({point, actual: team(point)})
    )
    // generate labelled training data
    const examples = length => labeller(points(length))

    return {
      weights,
      points,
      examples
    }
  }

  /**
   * Neural Network
   *
   * @param {object}
   * @param {object} weights {x,y} Initial weights
   * @param {array} examples [{x,y}] Training set examples
   * @returns {object} {trainedWeights,prediction} Required data to classify the chart points
   */
  const gym = (weights, examples) => {
    /**
     * Binary classifier
     *
     * TODO: Is this our activation function too?
     * I think so - effectively for a ReLU we want to return output not one
     * But we want a binary classifier
     * Ah perhaps this is not the activation function
     * It just happens that we're assuming that the dot product will never be less zero?
     * Or maybe this is a combination of the activation function and the classifier
     * For a binary classifier we should be using a sigmoid I think
     * But this appears to be using a ReLU and classifying as true if > 0
     *
     * @param {integer} output Neuron value before activation function
     * @returns {integer} Class of the example 0|1
     */
    const classifier = output => output > 0 ? 1 : 0
    /**
     * Matrix dot product
     *
     * @param {object} a {x,y}
     * @param {object} b {x,y}
     * @returns {float} Dot product value
     */
    const dot = (a, b) => a.x * b.x + a.y * b.y
    // make a prediction given the weigts and a point
    const prediction = (weights, point) => classifier(dot(weights, point))
    /**
     * Single training step
     *
     * @param {object} weights {x,y} I think this is typically {w1, w2}
     * @param {object} point {x,y} Training example typically x1, x2
     * @param {integer} actual 0|1 Correct label for the example
     * @returns {object} {x,y} updated weights
     */
    const train = (weights, point, actual) => {
      // also know as... y_hat
      const predict = prediction(weights, point)
      // TODO: I'm not convinced this is correct
      // Or at least I don't know why it's correct
      // It could be by accident because of the line we've chosen
      // possibilities are
      // actual: 0|1
      // predict: 0|1
      // error: 0|-1|1|0
      // Andrew Ng Deep Learning wk 2:
      // This does appear that we're using Logistic Regression
      // dZ = A - Y (N.B.  matrices, A = activation/predict, Y = actual)
      // dw = 1/m X . dZ_T (_T = matrix transpose)
      // In individual loop steps (m examples):
      // dw = x_1 * dz_1 + x_2 * dx_2 + ... x_m * dx_m (equivalent of {point.x, point.y} * error for all examples)
      // dw /= m (it seems we miss the division here)
      // w -= alpha * dw
      //
      // Comparing to my notes it seems like we calculate -error (or -dZ)
      // As A - Y is reversed
      // Then it makes sense to have a '+' when updating the weights
      const error = actual - predict
      // TODO: I think this is effectively the back propagation step
      // w := w - alpha * dw (as per Andrew Ng python deep learning code)
      // N.B. We're currently *not* using the learning rate (alpha)
      return {
        x: weights.x + (point.x * error),
        y: weights.y + (point.y * error)
      }
    }

    const trainer = (acc, example) => train(acc, example.point, example.actual)
    // TODO: I think just just does one iteration of gradient descent
    const trainedWeights = examples.reduce(trainer, weights)
    // console.log(trainedWeights)

    return {
      train,
      prediction,
      trainedWeights
    }
  }

  const chart = () => {
    const el = name => document.createElementNS(
      "http://www.w3.org/2000/svg",
      name
    )
    const circle = (centre, radius, colour) => {
      let c = el("circle")
      c.setAttribute("cx", centre.x)
      c.setAttribute("cy", centre.y)
      c.setAttribute("r", radius)
      c.style.fill = colour
      return c
    }
    const clickelem = el => {
      /* eslint no-console: "off" */
      el.onclick = e => console.log(e.target.attributes)
      return el
    }
    const line = (start, end, colour) => {
      let l = el("line")
      l.setAttribute("x1", start.x)
      l.setAttribute("y1", start.y)
      l.setAttribute("x2", end.x)
      l.setAttribute("y2", end.y)
      l.setAttribute("stroke", colour)
      return l
    }
    const svg = () => {
      let svg = el("svg")
      svg.setAttribute("height", Y_MAX)
      svg.setAttribute("width", X_MAX)
      return svg
    }

    return {
      clickelem,
      circle,
      line,
      svg
    }
  }

  const fill = (generator, gym, chart) => {
    const colours = ["red", "blue"]
    const graphPoints = generator.points(200)
    const svg = chart.svg()
    graphPoints.map(point => svg.appendChild(
      chart.clickelem(chart.circle(
        point,
        5,
        colours[gym.prediction(gym.trainedWeights, point)]
      ))
    ))
    graphPoints.map(point => svg.appendChild(
      chart.circle(point, 1, "white")
    ))
    // want the line to appear above the dots
    svg.appendChild(chart.line({x: 0, y: 0}, {x: X_MAX, y: Y_MAX}, "gray"))
    return svg
  }

  const chartGen = generator()
  const chartGym = gym(chartGen.weights, chartGen.examples(EXAMPLE_COUNT))
  document.getElementById("root").appendChild(fill(chartGen, chartGym, chart()))

  return {
    chartGym
  }
})()

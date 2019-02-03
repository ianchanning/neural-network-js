/* eslint no-unused-vars: "off" */
/**
 * This is an experiment to see if I can recreate funfunfunction's machine-learning / back-propagation code
 * @link https://www.youtube.com/watch?v=anN2Ey37s-o
 * @return object
 */
const nn = () => {
  "use strict"
  const X_MAX = 400
  const Y_MAX = 400
  // usually called the training set
  const EXAMPLE_COUNT = 10000 // set this to a low number for tests
  const TEST_COUNT = 200

  /**
   * Generate the required data specific for this network
   *
   * @returns {object} {weights,points} the initial weights and training/test data
   */
  const generator = () => {
    /**
     * Generate random number between min and max
     *
     * @param   {number} min
     * @param   {number} max
     * @returns {number} Random number
     */
    const rand = (min, max) => Math.random() * (max - min) + min
    // random set of data points
    const points = length => Array(length)
      .fill(0)
      .map((i) => ({
        x: rand(0, X_MAX),
        y: rand(0, Y_MAX)
      }))
    // initial random weights
    const weights = {
      x: rand(-1, 1),
      y: rand(-1, 1)
    }
    /**
     * we happen to know that this will classify out points correctly
     * so we can use it to generate actual labels for training examples
     * here x/y are coordinates in a SVG/CSS style where top left is 0,0
     * the line is then effectively y = x
     */
    const team = point => point.x > point.y ? 1 : 0
    const labeller = examples => examples.map(
      point => ({point, actual: team(point)})
    )
    // generate labelled training data
    const examples = length => labeller(points(length))

    return {
      weights,
      points,
      examples,
      rand
    }
  }

  /**
   * SVG chart with circles
   *
   * This is not part of the network
   * but it's important to show how easy it can be to visualise the data
   *
   * @returns {Object} Primitives for creating the chart
   */
  const chart = () => {
    const element = name => document.createElementNS(
      "http://www.w3.org/2000/svg",
      name
    )
    /**
     * @example <svg height="400" width="400">...</svg>
     */
    const svg = () => {
      let svg = element("svg")
      svg.setAttribute("height", Y_MAX.toString())
      svg.setAttribute("width", X_MAX.toString())
      return svg
    }
    /**
     * @example <circle cx="100" cy="100" r="5" />
     */
    const circle = (centre, radius, colour) => {
      let c = element("circle")
      c.setAttribute("cx", centre.x)
      c.setAttribute("cy", centre.y)
      c.setAttribute("r", radius)
      c.style.fill = colour
      return c
    }
    /**
     * @example <circle ... onclick="..." />
     */
    const clickelem = elem => {
      /* eslint no-console: "off" */
      elem.onclick = e => console.log(e.target.attributes)
      return elem
    }
    /**
     * @example <line x1="0" y1="0" x2="100" y2="100" stroke="black" />
     */
    const line = (start, end, colour) => {
      let l = element("line")
      l.setAttribute("x1", start.x)
      l.setAttribute("y1", start.y)
      l.setAttribute("x2", end.x)
      l.setAttribute("y2", end.y)
      l.setAttribute("stroke", colour)
      return l
    }

    return {
      clickelem,
      circle,
      line,
      svg
    }
  }

  /**
   * Perceptron / Neuron
   *
   * @param {object} weights {x,y} Initial weights
   * @param {array} examples [{x,y}] Training set examples
   * @returns {object} {trainedWeights,prediction} Required data to classify the chart points
   */
  const neuron = (weights, examples) => {
    /**
     * Perceptron binary classifier / activation function
     *
     * TODO: Is this our activation function too?
     * I think so, but this is purely for a perceptron
     * (incorrect) I think so - effectively for a ReLU we want to return output not one
     * But we want a binary classifier
     * (correct) Ah perhaps this is not the activation function
     * It just happens that we're assuming that the dot product will never be less zero?
     * (incorrect) Or maybe this is a combination of the activation function and the classifier
     * (incorrect) For a binary classifier we should be using a sigmoid I think
     * (incorrect) But this appears to be using a ReLU and classifying as true if > 0
     *
     * this is how the output of a perceptron is calculated
     * Perceptron is a the most basic form of a neuron
     * Next we use sigmoid
     * Then we use ReLU
     *
     *          | 0 if input <= threshold
     * output = |
     *          | 1 if input > threshold
     *
     * bias = -threshold
     *
     *          | 0 if input + bias <= 0
     * output = |
     *          | 1 if input + bias > 0
     *
     * @param {number} input Neuron value before activation function
     * @returns {number} Class of the example 0|1
     */
    const activation = input => input <= 0 ? 0 : 1
    /**
     * 1D matrix multiplication / vector dot product
     *
     * @param {object} a {x,y} Vector with two elements
     * @param {object} b {x,y} Vector with two elements
     * @returns {number} Dot product value
     */
    const dot = (a, b) => a.x * b.x + a.y * b.y
    /**
     * make a prediction given the weigts and a point
     *
     * @param {array} weights {x,y} weights matrix (just a 2D vector)
     * @param {array} point {x,y}
     */
    const prediction = (weights, point) => activation(dot(weights, point))
    /**
     * Single training step
     *
     * @param {object} weights {x,y} I think this is typically {w1, w2}
     * @param {object} point {x,y} Training example typically x1, x2
     * @param {number} actual 0|1 Correct label for the example
     * @returns {object} {x,y} updated weights
     */
    const train = (weights, point, actual) => {
      // also know as... y_hat
      const predict = prediction(weights, point)
      // TODO: I'm not convinced this is correct
      //       Or at least I don't know why it's correct
      //       It could be by accident because of the line we've chosen
      //       possibilities are
      //       actual: 0|1
      //       predict: 0|1
      //       error: 0|-1|1|0
      //       Andrew Ng Deep Learning wk 2:
      //       This does appear that we're using Logistic Regression
      //       dZ = A - Y (N.B.  matrices, A = activation/predict, Y = actual)
      //       dw = 1/m X . dZ_T (_T = matrix transpose)
      //       In individual loop steps (m examples):
      //       dw = x_1 * dz_1 + x_2 * dx_2 + ... x_m * dx_m
      //       (equivalent of {point.x, point.y} * error for all examples)
      //       dw = dw / m (it seems we miss the division here)
      //       w = w - alpha * dw
      //
      //       Viewing the Logistic Regression Cost Function video
      //       He has a difference in terminology between
      //       Loss (error) function - 1 example
      //       Cost function - avg. of m examples
      //
      //       Err, this is almost certainly Logistic regression backprop
      //
      //       z = w . x + b
      //       a = s(z)
      //       dz = dL/dz = a - y
      //       dw1 = dL/dw1 = x1 * dz
      //       dw2 = dL/dw2 = x2 * dz
      //
      //       Oh oh, it's possibly not,
      //       it looks like the learning algorithm for a single perceptron
      //       @link https://en.wikipedia.org/wiki/Perceptron#Learning_algorithm
      //
      // See also @link http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function
      //
      // Comparing to my notes it seems like we calculate -error (or -dZ)
      // As A - Y is reversed
      // Then it makes sense to have a '+' when updating the weights
      const error = actual - predict
      // TODO: I think this is effectively the back propagation step
      //       w := w - alpha * dw (as per Andrew Ng python deep learning code)
      //       N.B. We're currently *not* using the learning rate (alpha)
      //
      return {
        x: weights.x + (point.x * error),
        y: weights.y + (point.y * error)
      }
    }

    const trainer = (acc, example) => train(acc, example.point, example.actual)
    // TODO: This does one iteration of gradient descent
    //       It loops through all examples once
    //       This is the equivalent of doing one matrix multiplication
    //       You realise from this how that bias can become an issue
    //       If you pass over the same set of examples a million times
    //       Then you're going to be completely trained on all the details
    //       of those examples
    const trainedWeights = examples.reduce(trainer, weights)
    // console.log(trainedWeights)

    return {
      train,
      prediction,
      trainedWeights
    }
  }

  const build = (generator, neuron, chart) => {
    const colours = ["red", "blue"]
    const testPoints = generator.points(TEST_COUNT)
    const svg = chart.svg()
    testPoints.map(point => svg.appendChild(
      chart.clickelem(chart.circle(
        point,
        5,
        colours[neuron.prediction(neuron.trainedWeights, point)]
      ))
    ))
    testPoints.map(point => svg.appendChild(
      chart.circle(point, 1, "white")
    ))
    // want the line to appear in front of the dots so draw it after
    svg.appendChild(chart.line({x: 0, y: 0}, {x: X_MAX, y: Y_MAX}, "gray"))
    return svg
  }

  const draw = () => {
    const chartGen = generator()
    // note the connection with testPoints in the draw function
    const examplePoints = chartGen.examples(EXAMPLE_COUNT)
    const chartNeuron = neuron(chartGen.weights, examplePoints)
    const svg = build(chartGen, chartNeuron, chart())
    
    // ignore document for testing
    if (document.getElementById("root")) {
      document.getElementById("root").appendChild(svg)
    }
  
    return {
      chartNeuron,
      chartGen
    }
  }

  return draw()
}
export { nn }

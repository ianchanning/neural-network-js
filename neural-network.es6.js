/**
 * This is an experiment to see if I can recreate funfunfunction's machine-learning / back-propagation code
 *
 * Note: This source uses more modern ES6 syntax
 * The final version of the code following the tutorial is in tutorial/neural-network.final.js
 * @link https://www.youtube.com/watch?v=anN2Ey37s-o
 * @return object
 */
const nn = () => {
  "use strict";
  const X_MAX = 400;
  const Y_MAX = 400;
  // usually called the training set
  const EXAMPLE_COUNT = 400; // 80% of total
  const TEST_COUNT = 100; // 20% of total

  /**
   * Generate the required data specific for this network
   *
   * @returns {object} {weights, points, examples} initial weights, test data, training data
   */
  const generator = () => {
    /**
     * Generate random number between min and max
     *
     * @param   {number} min
     * @param   {number} max
     * @returns {number} Random number
     */
    const rand = (min, max) => Math.random() * (max - min) + min;

    /**
     * Set of random data points
     * @param {number} length how many points
     * @returns {array} [[x1,x2],...]
     */
    const points = (length) =>
      Array(length)
        .fill(0)
        .map(() => [rand(0, X_MAX), rand(0, Y_MAX)]);

    // Initial random weights [w1,w2]
    const weights = [rand(-1, 1), rand(-1, 1)];

    /**
     * We happen to know that this will classify out points correctly
     * so we can use it to generate actual labels for training examples
     * here x/y are coordinates in a SVG/CSS style where top left is 0,0
     * the line is then effectively y = x
     * @param {array} point [x1, x2]
     * @returns {number} 0|1 which team
     */
    const team = (point) => (point[0] > point[1] ? 1 : 0);

    /**
     *
     * @param {array} points [[x1,x2],...]
     * @returns {array} [{point,actual},...]
     */
    const labeller = (points) =>
      points.map((point) => ({ point, actual: team(point) }));

    /**
     * Labelled training data
     *
     * @param {number} length how many examples
     * @returns {array} [{point,actual},...]
     */
    const examples = (length) => labeller(points(length));

    return { weights, points, examples };
  };

  /**
   * SVG chart with circles
   *
   * This is not part of the network
   * but it's important to show how easy it can be to visualise the data
   *
   * @returns {Object} Primitives for creating the chart
   */
  const chart = (height, width) => {
    /**
     *
     * @param {string} name element name
     * @param {object} attrs attributes
     * @returns {object} SVG element
     */
    const element = (name, attrs) => {
      let elem = document.createElementNS("http://www.w3.org/2000/svg", name);
      Object.keys(attrs).map((key) => {
        elem.setAttribute(key, attrs[key]);
      });
      return elem;
    };
    /**
     * @example <svg height="400" width="400">...</svg>
     */
    const svg = () => element("svg", { height, width });
    /**
     * Circle
     * @param {array} centre [x1,x2]
     * @param {number} r radius
     * @param {string} fill colour
     * @example <circle cx="100" cy="100" r="5" />
     */
    const circle = ([cx, cy], r, fill) =>
      element("circle", { cx, cy, r, fill });
    /**
     * @example <circle ... onclick="..." />
     */
    const clickelem = (elem) => {
      /* eslint no-console: "off" */
      elem.onclick = (e) => console.log(e.target.attributes);
      return elem;
    };
    /**
     * start, end [x1,x2]
     * @example <line x1="0" y1="0" x2="100" y2="100" stroke="black" />
     */
    const line = ([x1, y1], [x2, y2], stroke) =>
      element("line", { x1, y1, x2, y2, stroke });

    return { clickelem, circle, line, svg };
  };

  /**
   * Perceptron / Neuron
   *
   * @returns {object} {trainedWeights,prediction} Required data to classify the chart points
   */
  const neuron = () => {
    /**
     * Perceptron binary classifier / activation function
     *
     * Q: Is this our activation function too?
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
     * @param {number} z Neuron value before activation function
     * @returns {number} Class of the example 0|1
     */
    const activation = (z) => (z <= 0 ? 0 : 1);
    /**
     * 1D matrix multiplication / vector dot product
     *
     * @param {array} a [x1,x2] Vector with two elements
     * @param {array} b [x1,x2] Vector with two elements
     * @returns {number} Dot product value
     */
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

    /**
     * make a prediction given the weights and a point
     *
     * @param {array} w [x1,x2] weights matrix (just a 2D vector)
     * @param {array} x [x1,x2]
     * @returns {number} predicted output of the neuron
     */
    const prediction = (w, x) => activation(dot(w, x));

    /**
     * The positive or negative adjustment required
     *
     * @param {number} y the value of the labelled data
     * @param {number} a the predicted output of the neuron
     * @returns {number} size of the prediction error
     */
    const diff = (y, a) => y - a;

    /**
     * Feed the error back into the weights
     *
     * @param {number} w_i w[i] weights matrix
     * @param {number} x_i x[i]
     * @param {number} ydiff size of the prediction error
     */
    const adjust = (w_i, x_i, ydiff) => w_i + ydiff * x_i;

    /**
     * Single training step
     *
     * @param {object} w [w1,w2] I think this is typically {w1, w2}
     * @param {object} x [x1,x2] Training example typically x1, x2
     * @param {number} y 0|1 Correct label for the example
     * @returns {object} [x1,x2] updated weights
     */
    const step = (w, x, y) => {
      // also know as... y_hat
      const a = prediction(w, x);
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
      //       (equivalent of {point[0], point[1]} * error for all examples)
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
      //       Oh oh, it's not,
      //       it looks like the learning algorithm for a single perceptron
      //       @link https://en.wikipedia.org/wiki/Perceptron#Learning_algorithm
      //
      // See also @link http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function
      //
      // Comparing to my notes it seems like we calculate -error (or -dZ)
      // As A - Y is reversed
      // Then it makes sense to have a '+' when updating the weights
      const ydiff = diff(y, a);
      // TODO: I think this is effectively the back propagation step
      //       w := w - alpha * dw (as per Andrew Ng python deep learning code)
      //       N.B. We're currently *not* using the learning rate (alpha)
      //
      return [adjust(w[0], x[0], ydiff), adjust(w[1], x[1], ydiff)];
    };

    /**
     * TODO: This does one iteration of gradient descent
     *       It loops through all examples once
     *       This is the equivalent of doing one matrix multiplication
     *       You realise from this how that bias can become an issue
     *       If you pass over the same set of examples a million times
     *       Then you're going to be completely trained on all the details
     *       of those examples
     *
     * @param {array} w [w1,w2] weights matrix
     * @param {array} examples [[x1,x2],...]
     */
    const train = (w, examples) => {
      // wrapper function for the reduce
      const trainStep = (w, example) => step(w, example.point, example.actual);
      return examples.reduce(trainStep, w);
    };

    /**
     * Loss (error) function
     *
     * Euclidean distance between predict and actual
     * sqrt((y - a) ** 2) = abs(y - a)
     *
     * @param {array} w weights [w1,w2]
     * @param {object} example {point,actual}
     * @returns {number} distance
     */
    const loss = (w, example) =>
      Math.abs(example.actual - prediction(w, example.point));

    /**
     * Cost function
     *
     * The average of all loss functions
     *
     * @param {array} w weights [w1,w2]
     * @param {array} examples [{point,actual},...]
     * @returns {number} average loss
     */
    const cost = (w, examples) => {
      const sum = (total, example) => {
        // console.log({ w, loss: loss(w, example) });
        return total + loss(w, example);
      };
      return (1 / examples.length) * examples.reduce(sum, 0);
    };

    /**
     * Gradient Descent (if activation were differentiable)
     *
     * @param {array} w [w1,w2] intial weights
     * @param {array} examples [{point,actual},...]
     * @param {number} threshold low enough cost
     * @param {number} epochs max iterations
     * @returns {array} [w1,w2] trained weights
     */
    const gradDescent = (w, examples, threshold, epochs) =>
      epochs < 0 || cost(w, examples) < threshold
        ? w
        : gradDescent(train(w, examples), examples, threshold, epochs - 1);

    return { prediction, train, gradDescent };
  };

  const build = (generator, chart, neuron) => {
    const svg = chart.svg();
    const colours = ["red", "blue"];
    const initialWeights = generator.weights;
    const weights = neuron.gradDescent(
      initialWeights,
      generator.examples(EXAMPLE_COUNT),
      0.0001, // threshold
      100 // epochs
    );
    generator.points(TEST_COUNT).map((point) => {
      const team = neuron.prediction(weights, point);
      svg.appendChild(chart.clickelem(chart.circle(point, 5, colours[team])));
      svg.appendChild(chart.circle(point, 1, "white"));
    });
    // want the line to appear in front of the dots so draw it after
    svg.appendChild(chart.line([0, 0], [X_MAX, Y_MAX], "gray"));
    return { svg, initialWeights, weights };
  };

  const draw = () => {
    const drawP = (text) => {
      let elem = document.createElement("p");
      elem.innerText = text;
      document.getElementById("root").append(elem);
    };
    const chartGenerator = generator();
    const chartNeuron = neuron();
    const chartBuild = build(chartGenerator, chart(X_MAX, Y_MAX), chartNeuron);

    if (document.getElementById("root")) {
      drawP("(0,0) Note: SVG origin is top left");
      document.getElementById("root").appendChild(chartBuild.svg);
      drawP("initial weights: " + chartBuild.initialWeights.join());
      drawP("trained weights: " + chartBuild.weights.join());
    }

    return { chartNeuron, chartGenerator };
  };

  return draw();
};
nn();

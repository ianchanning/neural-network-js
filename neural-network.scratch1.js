/* eslint no-unused-vars: "off" */
/**
 * This is an experiment to see if I can recreate funfunfunctions machine-learning / back-propagation code
 * @link https://www.youtube.com/watch?v=anN2Ey37s-o
 * @return object
 */
const nn = () => {
  "use strict"

  const EXAMPLE_COUNT = 40000

  const generator = () => {
    /**
     * Random number between min and max
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    const rand = (min, max) => Math.random() * (max - min) + min

    /**
     * Set of random svg x,y points
     * @param {number} count 
     */
    const points = (count) => []

    /**
     * Label a point a particular colour
     * @param {object} point 
     * @returns {string}
     */
    const label = (point) => point.x > point.y ? 'red' : 'blue'
    /**
     * Add labels to a set of points    
     * @param {array} points Set of x,y points
     * @returns {array}
     */
    const labeller = (points) => points.map(label)

    /**
     * Generate a set of labelled training examples
     * 
     * @param {number} count How many examples to generate
     * @returns {array}
     */
    const examples = count => labeller(points(count))

    return { rand, examples }
  }
  const chart = undefined
  const neuron = undefined
  const draw = undefined

  const chartGen = generator()
  const examplePoints = chartGen.examples(EXAMPLE_COUNT)
  const chartNeuron = neuron(chartGen.weights, examplePoints)

  document.getElementById("root").appendChild

}
export { nn }

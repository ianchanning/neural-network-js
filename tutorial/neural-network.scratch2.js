/* eslint no-unused-vars: "off" */
/**
 * This is an experiment to see if I can recreate funfunfunctions machine-learning / back-propagation code
 * @link https://www.youtube.com/watch?v=anN2Ey37s-o
 * @return object
 */
const nn = () => {
  "use strict"

  const generator = () => {
    const rand = (min, max) => Math.random() * (max - min) + min

    const examples = (length) => Array(length).fill(0)
    return { rand, examples }
  }
  const chartGen = generator()

  return {
    chartGen
  }
}
export { nn }

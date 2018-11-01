/**
 * This is an experiment to see if I can recreate funfunfunctions machine-learning / back-propagation code
 *
 * Step 1 is to recreate the JS code
 * Step 2 is to port to ReasonML
 */

const rand = x => Math.random() * x
const X_MAX = 400
const Y_MAX = 400
const points = Array(100).fill().map(x => ({
  x: rand(X_MAX),
  y: rand(Y_MAX)
}))

// console.log(points)

let root = document.getElementById('root')
let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg')
svg.setAttribute('height', Y_MAX)
svg.setAttribute('width', X_MAX)
svg.setAttribute('xmlns',"http://www.w3.org/2000/svg")
const ci = point => {
  let circle = document.createElementNS("http://www.w3.org/2000/svg",'circle')
  circle.setAttribute('cx',point.x)
  circle.setAttribute('cy',point.y)
  circle.setAttribute('r',5)
  // circle.setAttribute('style','color:black')
  return circle
}
points.map(point => svg.appendChild(ci(point)))
// svg.appendChild(ci(points[0]))
document.body.appendChild(svg)


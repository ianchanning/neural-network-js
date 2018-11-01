(() => {
  "use strict"
  /**
   * This is an experiment to see if I can recreate funfunfunctions machine-learning / back-propagation code
   *
   * Step 1 is to recreate the JS code
   * Step 2 is to port to ReasonML
   */
  const X_MAX = 400
  const Y_MAX = 400
  const rand = x => Math.random() * x
  const points = Array(100).fill().map(() => ({
    x: rand(X_MAX),
    y: rand(Y_MAX)
  }))
  const draw = () => {
    const el = (name) => document.createElementNS("http://www.w3.org/2000/svg", name)
    const ci = point => {
      let circle = el("circle")
      circle.setAttribute("cx", point.x)
      circle.setAttribute("cy", point.y)
      circle.setAttribute("r",5)
      // circle.setAttribute("style", "color:black")
      return circle
    }

    let root = document.getElementById("root")
    let svg = el("svg")
    svg.setAttribute("height", Y_MAX)
    svg.setAttribute("width", X_MAX)

    points.map(point => svg.appendChild(ci(point)))
    root.appendChild(svg)
  }
  draw()
})()

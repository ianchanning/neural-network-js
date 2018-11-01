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
  const weights = Array(100).fill().map(() => ({
    x: rand(1),
    y: rand(1)
  }))
  const classifier = (output) => output > 0 ? 1 : 0
  const dot = (w, p) => w.x * p.x + w.y * p.y
  const prediction = (weight, point) => classifier(dot(weight, point))

  const chart = (prediction) => {
    const el = (name) => document.createElementNS("http://www.w3.org/2000/svg", name)
    const colours = ["red", "blue"]
    const circ = (point, colour) => {
      let circle = el("circle")
      circle.setAttribute("cx", point.x)
      circle.setAttribute("cy", point.y)
      circle.setAttribute("r",5)
      circle.style.fill = colour
      return circle
    }

    let line = el("line")
    line.setAttribute("x1", 0)
    line.setAttribute("y1", 0)
    line.setAttribute("x2", X_MAX)
    line.setAttribute("y2", Y_MAX)
    line.setAttribute("stroke", "gray")

    let svg = el("svg")
    svg.setAttribute("height", Y_MAX)
    svg.setAttribute("width", X_MAX)
    svg.appendChild(line)

    points.map(point => svg.appendChild(circ(point, colours[prediction({x:1,y:1}, point)])))
    return svg
  }

  document.getElementById("root").appendChild(chart(prediction))
})()

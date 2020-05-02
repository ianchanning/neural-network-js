function nn() {
  "use strict";
  /**
   * data
   */
  function generator() {}

  /**
   * SVG chart elements
   */
  function chart() {}

  /**
   * perceptron / neuron
   */
  function neuron() {}

  /**
   * generator + neuron + chart
   */
  function build() {}

  /**
   * draw the chart to root `<div>`
   */
  function draw() {
    function drawP(text) {
      var elem = document.createElement("p");
      elem.innerText = text;
      document.getElementById("root").append(elem);
    }
    drawP("(0,0)");
  }

  draw();
}
nn();

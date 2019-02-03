function nn() {
  "use strict";
  /**
   * generating random data
   * generating test and labelled training data
   */
  function generator() {
    // random value between min and max
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    // a set of random points
    function points(length) {
      return Array(length)
        .fill(0)
        .map(function(i) {
          return {
            x: rand(0, 400),
            y: rand(0, 400)
          }
        });
    }

    return {rand, points};
  }

  /**
   * SVG chart elements
   */
  function chart(height, width) {
    // <name xmlns="..."></name>
    function element(name) {
      return document.createElementNS(
        "http://www.w3.org/2000/svg",
        name
      );
    }

    // <svg ...></svg>
    function svg() {
      var svg = element("svg");
      svg.setAttribute("height", height);
      svg.setAttribute("width", width);
      return svg;
    }

    // centre is a point {x,y}
    // <circle cx="0" cy="0" r="4" fill="blue"></circle>
    function circle(centre, radius, colour) {
      var c = element("circle");
      c.setAttribute("cx", centre.x);
      c.setAttribute("cy", centre.y);
      c.setAttribute("r", radius);
      c.setAttribute("fill", colour);
      return c;
    }

    return {svg, circle};
  }

  /**
   * the bit we care about
   */
  function neuron() {
  }

  /**
   * generator + neuron + chart
   */
  function build(generator, chart) {
    var mySvg = chart.svg();
    generator.points(100).map(function(point) {
      mySvg.appendChild(chart.circle(point, 4, "black"));
    });
    return mySvg;
  }

  /**
   * draw the chart to the screen
   */
  function draw() {
    var elem = document.createElement("p");
    elem.innerText = "(0,0)";
    document.getElementById("root").prepend(elem);
    var svg = build(generator(), chart(400, 400));
    document.getElementById("root").appendChild(svg);
  }

  return draw();
}

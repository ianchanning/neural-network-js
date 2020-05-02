function nn() {
  "use strict";
  /**
   * data
   */
  function generator() {
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
    function points(length) {
      return Array(length)
        .fill(0)
        .map(function() {
          return [rand(0, 400), rand(0, 400)];
        });
    }
    return { rand, points };
  }

  /**
   * SVG chart elements
   */
  function chart(height, width) {
    // <name xmlns="..."></name>
    function element(name) {
      var ns = "http://www.w3.org/2000/svg";
      return document.createElementNS(ns, name);
    }
    // <svg ...></svg>
    function svg() {
      // JS note: svg() can access element()
      // var s is private to svg()
      var s = element("svg");
      s.setAttribute("height", height);
      s.setAttribute("width", width);
      return s;
    }

    // centre is a point [x1,x2]
    // <circle cx="0" cy="0" r="4" fill="blue"></circle>
    function circle(centre, radius, colour) {
      var c = element("circle");
      c.setAttribute("cx", centre[0]);
      c.setAttribute("cy", centre[1]);
      c.setAttribute("r", radius);
      c.setAttribute("fill", colour);
      return c;
    }
    // start, end are points [x1,x2]
    // <line x1="0" y1="0" x2="10" y2="10" fill="blue"></line>
    function line(start, end, colour) {
      var l = element("line");
      l.setAttribute("x1", start[0]);
      l.setAttribute("y1", start[1]);
      l.setAttribute("x2", end[0]);
      l.setAttribute("y2", end[1]);
      l.setAttribute("stroke", colour);
      return l;
    }
    return { svg, circle, line };
  }

  /**
   * perceptron / neuron
   */
  function neuron() {}

  /**
   * generator + neuron + chart
   */
  function build(generator, chart) {
    var svg = chart.svg();
    var colours = ["red", "blue"];
    generator.points(100).map(function(point) {
      var team = Math.round(Math.random());
      svg.appendChild(chart.circle(point, 4, colours[team]));
    });
    svg.appendChild(chart.line([0, 0], [400, 400], "black"));
    return svg;
  }

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
    var myGenerator = generator();
    var myChart = chart(400, 400);
    var svg = build(myGenerator, myChart);
    document.getElementById("root").appendChild(svg);
  }

  draw();
}
nn();

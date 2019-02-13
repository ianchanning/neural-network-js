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
    // which side of the wall
    function team(point) {
      return point[0] > point[1] ? 1 : 0;
    }
    // points is a set of [x1,x2] points
    function labeller(points) {
      return points.map(function(point) {
        return {
          point: point,
          actual: team(point)
        };
      });
    }

    // labelled training data
    function examples(length) {
      return labeller(points(length));
    }
    return { points, team, examples };
  }

  /**
   * SVG chart elements
   */
  function chart(height, width) {
    // <name xmlns="..."></name>
    function element(name, attrs) {
      var ns = "http://www.w3.org/2000/svg";
      var elem = document.createElementNS(ns, name);
      Object.keys(attrs).map(function(key) {
        elem.setAttribute(key, attrs[key]);
      });
      return elem;
    }

    // <svg ...></svg>
    function svg() {
      return element("svg", { height, width });
    }

    // centre is a point [x1,x2]
    // <circle cx="0" cy="0" r="4" fill="blue"></circle>
    function circle(centre, r, fill) {
      var [cx, cy] = centre;
      return element("circle", { cx, cy, r, fill });
    }

    // start, end are points [x1,x2]
    // <line x1="0" y1="0" x2="1" y2="1" stroke="red"></line>
    function line(start, end, stroke) {
      var [x1, y1] = start;
      var [x2, y2] = end;
      return element("line", { x1, y1, x2, y2, stroke });
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
      // var team = Math.round(Math.random());
      var team = generator.team(point);
      svg.appendChild(chart.circle(point, 4, colours[team]));
    });
    svg.appendChild(chart.line([0, 0], [400, 400], "black"));
    return { svg };
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
    var myBuild = build(myGenerator, myChart);
    document.getElementById("root").appendChild(myBuild.svg);
  }

  draw();
}

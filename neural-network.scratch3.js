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

    // which side of the wall
    function team(point) {
      return (point.x > point.y) ? 1 : 0;
    }
    
    // points is a set of {x,y} points
    function labeller(points) {
      points.map(function(point) {
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

    return {rand, points, team, examples};
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

    // start, end are points {x,y}
    // <line x1="0" y1="0" x2="10" y2="10" fill="blue"></line>
    function line(start, end, colour) {
      var l = element("line");
      l.setAttribute("x1", start.x);
      l.setAttribute("y1", start.y);
      l.setAttribute("x2", end.x);
      l.setAttribute("y2", end.y);
      l.setAttribute("stroke", colour);
      return l;
    }

    return {svg, circle, line};
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
    var svg = chart.svg();
    var colours = ["red", "blue"];
    generator.points(100).map(function(point) {
      var team = generator.team(point);
      svg.appendChild(chart.circle(point, 4, colours[team]));
    });
    svg.appendChild(chart.line({x: 0, y: 0}, {x: 400, y: 400}, "black"));
    return svg;
  }

  /**
   * draw the chart to the screen
   */
  function draw() {
    var elem = document.createElement("p");
    elem.innerText = "(0,0)";
    document.getElementById("root").prepend(elem);
    var myGenerator = generator();
    var myChart = chart(400, 400);
    var svg = build(myGenerator, myChart);
    document.getElementById("root").appendChild(svg);
  }

  return draw();
}

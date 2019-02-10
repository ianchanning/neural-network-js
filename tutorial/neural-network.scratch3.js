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
          return [
            rand(0, 400),
            rand(0, 400)
          ]
        });
    }

    // which side of the wall
    function team(point) {
      return (point[0] > point[1]) ? 1 : 0;
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

    // experiment with (0,0) or rand(0,400), or rand(0,1)
    var weights = [rand(-1,1), rand(-1,1)];

    return {rand, points, team, examples, weights};
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

    return {svg, circle, line};
  }

  /**
   * the bit we care about
   */
  function neuron() {    
    // 2-D dot product only, [x1,x2], [x1,x2]
    function dot(w, x) {return w[0] * x[0] + w[1] * x[1];}

    // z = w . x + bias (but no bias here)
    // a = g(z)
    function activation(z) {return (z <= 0) ? 0 : 1;}

    // y = g(w . x)
    function prediction(w, x) {
      return activation(dot(w,x));
    }

    function loss(y, prediction) {
      return y - prediction;
    }

    function adjust(w, x, loss, i) {
      return w[i] + loss * x[i];
    }
    
    // step 1: initialise weights w
    // step 2: for each example x with actual y
    function step(w, x, y) {
      // step 2a: calculation actual output
      var yhat = prediction(w, x);
      // step 2b: update the weights for each x[i]
      var l = loss(y, yhat);
      return [
        adjust(w, x, l, 0),
        adjust(w, x, l, 1)
      ];
    }

    // intial weights w
    // labelled examples
    function train(w, examples) {
      // wrapper function to work with reduce
      function trainExample(w, example) {
        return step(w, example.point, example.actual);
      }
      // repeatedly updates w and returns the trained w
      return examples.reduce(trainExample, w);
    }

    return {prediction, train}
  }

  /**
   * generator + neuron + chart
   */
  function build(generator, chart, neuron) {
    var svg = chart.svg();
    var colours = ["red", "blue"];
    var weights = neuron.train(
      generator.weights,
      generator.examples(100)
    );

    generator.points(100).map(function(point) {
      // var team = generator.team(point);
      // var team = neuron.prediction(generator.weights, point);
      var team = neuron.prediction(weights, point);
      svg.appendChild(chart.circle(point, 4, colours[team]));
    });
    svg.appendChild(chart.line([0, 0], [400, 400], "black"));
    return {svg, weights};
  }

  /**
   * draw the chart to the screen
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
    var myNeuron = neuron();
    var myBuild = build(myGenerator, myChart, myNeuron);
    document.getElementById("root").appendChild(myBuild.svg);
    drawP("initial w: "+myGenerator.weights.join());
    drawP("trained w: "+myBuild.weights.join());
  }

  return draw();
}

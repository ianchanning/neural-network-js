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

    // experiment with (0,0) or rand(0,400), or rand(0,1)
    var weights = [rand(-1, 1), rand(-1, 1)];

    return { points, team, examples, weights };
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
  function neuron() {
    // 2-D dot product only, [w1,w2], [x1,x2]
    function dot(w, x) {
      return w[0] * x[0] + w[1] * x[1];
    }

    // z = dot(w, x) + bias
    // a = g(z)
    function activation(z) {
      return z <= 0 ? 0 : 1;
    }

    // a = g(w . x + b)
    function prediction(w, x) {
      return activation(dot(w, x));
    }
    function diff(y, a) {
      return y - a;
    }

    function adjust(w_i, x_i, ydiff) {
      return w_i + ydiff * x_i;
    }
    // step 1: initialise weights w
    // step 2: for each example x with actual y
    function step(w, x, y) {
      // step 2a: calculation actual output
      var a = prediction(w, x);
      // step 2b: update the weights for each x[i]
      var ydiff = diff(y, a);
      return [adjust(w[0], x[0], ydiff), adjust(w[1], x[1], ydiff)];
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

    // sqrt((y - a) ** 2) = abs(y - a)
    function loss(w, example) {
      var predict = prediction(w, example.point);
      return Math.abs(example.actual - predict);
    }

    // the average of all loss functions
    function cost(w, examples) {
      function sum(total, example) {
        // console.log({w, loss: loss(w, example)});
        return total + loss(w, example);
      }
      return (1 / examples.length) * examples.reduce(sum, 0);
    }
    // threshold when cost is low enough
    // how many iterations (epochs)
    function gradDescent(w, examples, threshold, epochs) {
      var c = cost(w, examples);
      if (epochs < 0 || c < threshold) {
        return w;
      }
      var wt = train(w, examples);
      return gradDescent(wt, examples, threshold, epochs - 1);
    }
    return { prediction, step, train, gradDescent };
  }

  /**
   * generator + neuron + chart
   */
  function build(generator, chart, neuron) {
    var svg = chart.svg();
    var colours = ["red", "blue"];
    // slide 39 start
    // var example = generator.examples(1);
    // var weights = neuron.step(
    //   generator.weights, // w
    //   example[0].point, // x
    //   example[0].actual // y
    // );
    // slide 39 end
    // slide 43 start
    // var weights = neuron.train(
    //   generator.weights,
    //   generator.examples(400) // how many?
    // );
    // slide 43 end
    // slide 50 start
    // var weights = neuron.gradDescent(
    //   generator.weights,
    //   generator.examples(400),
    //   0.0001, // threshold
    //   100 // epochs
    // );
    // slide 50 end
    generator.points(100).map(function(point) {
      var team = Math.round(Math.random());
      // slide 22
      // var team = generator.team(point);
      // slide 35
      // var team = neuron.prediction(generator.weights, point);
      // slide 39
      // var team = neuron.prediction(weights, point);
      svg.appendChild(chart.circle(point, 4, colours[team]));
    });
    svg.appendChild(chart.line([0, 0], [400, 400], "black"));

    return { svg };
    // slide 44
    // return { svg, weights };
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
    var myNeuron = neuron();
    var myBuild = build(myGenerator, myChart, myNeuron);
    document.getElementById("root").appendChild(myBuild.svg);
    // slide 35
    // drawP("intial w: " + myGenerator.weights.join());
    // slide 43
    // drawP("trained w: " + myBuild.weights.join());
  }

  draw();
}

# A Neural Network from scratch in JavaScript 

[![Screenshot](neural-network-screenshot.png)](neural-network-screenshot.png)

**Quickstart:** Download the zip and open `index.html`

The code works but the explantion/slides are **Work In Progress**

Each section here will be eventually turned into a slide

# Slides

% A Neural Network for the JavaScript programmer
% Ian Channing
% November 25, 2018

## The beginning

Let's live code a neural network and a data visualization

Is inspired / blatantly copied from:

* [Funfunfunction NN playlist](https://www.youtube.com/watch?v=anN2Ey37s-o)
* [deeplearning.ai week 2](https://www.coursera.org/learn/neural-networks-deep-learning/)
* [NN & DL course](http://neuralnetworksanddeeplearning.com)

## Slight digression (it'll be worth it in the long run)

Now I will actually start

With a side-topic...

JavaScript's `map` and `reduce` functions in maths

Reduce the gap between maths and code

## $y = f(x) = 2x$

Still with me?

Let's draw a graph

      y
      ^
      |
    4 |   +
    3 |
    2 | +
    1 |
    0 +------> x
      0 1 2

## Mathsy definitions

This is actually University level maths - Set Theory.

But I'll try anyway.

What's the mathsy name for:

> I've got one 'set' and I want to go to another 'set'?

     xs                 ys
    +-------+          +-------+
    | 0 1 2 | -- f --> | 0 2 4 |
    +-------+          +-------+

## Mathsy definitions

Mapping!

**Still with me?**

## $f(x)$ in JavaScript

$y = f(x) = 2x$

```javascript
function f(x) {return 2 * x;}
// could have called it 'double'
// function double(x) {return 2 * x;}
var xs = [0,1,2]; // want output [0,2,4]
var ys = xs.map(f); // [0,2,4]
```

## 2 + 2 + 2

$y = {\sum} f(x) = {\sum} 2x$

     x  2x Running total
     1  2  2
     1  2  4
    +1 +2  6
    -- --
     3  6

```javascript
function sum(t, x) { return t + f(x); }
var xs = [1,1,1];
var y  = xs.reduce(sum, 0); // 6
```

## I want it to display random values

Generate random test and training sets

```javascript
function rand(min, max) {
  return Math.rand() * (max - min) + min;
}
rand(1,3);
rand(0,400); // what we actually use
```

Stretch (`*`) and shift (`+`)

    rand(0,1) -->  rand(1,3)

    0     1     2     3
    +-----+
    +-----+-----+        (Stretch by (3 - 1))
          +-----+-----+  (Shift by 1)

## I want to generate a set of random test values
## I want to generate a set of random examples

## I want to display these test values
### I want to draw a circle
### I want to draw the test values as circles on a graph
### I want to separate these circles with a line
### I want to colour the circles red or blue
### I want to make the colour depend on which side of the line
## I want to say whether my examples are red or blue
## I want to make a guess based on x, y whether a circle is red or blue
## Todo ...
## I want to specify the cost function

Let's meet the the [cross entropy][1] cost function.

The bit we use is the derivative for back-propagation in eqn (61)

$dC/dW_j = 1/n * {\sum_x} x_j (s(z)-y)$

## To be continued...

[1]: http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function

# A Neural Network for the JavaScript programmer

[![Screenshot](neural-network-screenshot.png)](neural-network-screenshot.png)

**The code works but the explantion is Work In Progress**

**Quickstart:** Download the zip and open `index.html`

Each section here will be eventually turned into a slide

Let's live code:
* a neural network
* data visualization

This is a mashup of:

* [Funfunfunction playlist on Neural Networks](https://www.youtube.com/watch?v=anN2Ey37s-o)
* [Andrew Ng's deeplearning.ai week 2](https://www.coursera.org/learn/neural-networks-deep-learning/)
* [Neural Networks and Deep Learning course](http://neuralnetworksanddeeplearning.com)

# Where it all goes wrong

Talks that promise 'simple' go bad at slide two

First slide: "This is going to be simple!"

Second slide "This isn't simple"

Game Over.

# Ha! I made it to slide 3

Now I will actually start

With a side-topic...

JavaScript's `map` and `reduce` functions in maths

Reduce the gap between maths and code

# 𝒚 = 𝒇(𝒙) = 2𝒙

Still with me?

Let's draw a graph

      𝒚
      ^
      |
    4 |   +
    3 |
    2 | +
    1 |
    0 +------> 𝒙
      0 1 2

# Mathsy definitions

This is actually University level maths - Set Theory. 

But I'll try anyway.

What's the mathsy name for:

> I've got one 'set' and I want to go to another 'set'?

     𝒙s                    𝒚s
    +-------+          +-------+
    | 0 1 2 | -- 𝒇 --> | 0 2 4 |
    +-------+          +-------+

Mapping!

**Still with me?**

# 𝒇(𝒙) in JavaScript

𝒚 = 𝒇(𝒙) = 2𝒙

```javascript
function f(x) {return 2 * x;}
// could have called it 'double'
// function double(x) {return 2 * x;}
var xs = [0,1,2]; // want output [0,2,4]
var ys = xs.map(f); // [0,2,4]
```

# 2 + 2 + 2

𝒚 = ∑ 𝒇(𝒙) = ∑ 2𝒙

     𝒙  2𝒙 Running total
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

# Lets get random

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

# Neural Network time

Let's meet the the [cross entropy][1] cost function.

The bit we use is the derivative for back-propagation in eqn (61)

dC/dW_j = 1/n * ∑ x_j (s(z)-y)

# To be continued...

[1]: http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function

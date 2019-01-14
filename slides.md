% A Neural Network for the JavaScript programmer
% Ian Channing
% November 25, 2018

# The beginning

Let's generate some random data, visualize it and train a neuron to classify it

> Young man, in mathematics you don't understand things. You just get used to them.
> — John Von Neumann

# Inspired / blatantly copied from

* [Funfunfunction NN playlist][3] (but it's missing maths)
* [deeplearning.ai week 2][4] (code isn't open, filling in blanks)
* [NN & DL course][5] (no code)

So I want to try and give some respect to the code & the maths

I'm going to sneak some functional programming in

# Slight digression (it'll be worth it in the long run)

JavaScript's `map` and `reduce` functions in maths

Reduce the gap between maths and code

# <img src="/tex/7ff425bd7d5c3e42836a2879e47ac5bd.svg?invert_in_darkmode&sanitize=true" align=middle width=102.0964989pt height=24.65753399999998pt/>

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

# Mathsy definitions

This is actually University level maths - Set Theory.

But I'll try anyway.

What's the mathsy name for:

> I've got one 'set' and I want to go to another 'set'?

     xs                 ys
    +-------+          +-------+
    | 0 1 2 | -- f --> | 0 2 4 |
    +-------+          +-------+

# Mathsy definitions

Mapping!

**Still with me?**

# <img src="/tex/7997339883ac20f551e7f35efff0a2b9.svg?invert_in_darkmode&sanitize=true" align=middle width=31.99783454999999pt height=24.65753399999998pt/> in JavaScript

<img src="/tex/7ff425bd7d5c3e42836a2879e47ac5bd.svg?invert_in_darkmode&sanitize=true" align=middle width=102.0964989pt height=24.65753399999998pt/>

```javascript
function f(x) {return 2 * x;}
// could have called it 'double'
// function double(x) {return 2 * x;}
var xs = [0,1,2]; // want output [0,2,4]
var ys = xs.map(f); // [0,2,4]
```

# 2 + 2 + 2

<img src="/tex/1931ea285f03835bed05989c550c8dae.svg?invert_in_darkmode&sanitize=true" align=middle width=136.79980214999998pt height=24.657735299999988pt/>

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

# I want it to display random values

Generate random test and training sets

```javascript
function rand(min, max) {
  return Math.random() * (max - min) + min;
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

# I want to generate a set of random test values
# I want to generate a set of random examples

# I want to display these test values
## I want to draw a circle
## I want to draw the test values as circles on a graph
## I want to separate these circles with a line
## I want to colour the circles red or blue
## I want to make the colour depend on which side of the line
# I want to say whether my examples are red or blue
# I want to make a guess based on x, y whether a circle is red or blue
# I want to visualise the functions we're going to use to improve the guesses
# A neural network of one neuron

> An Englishman, even if he is alone, forms an orderly queue of one
> - George Mikes

Simplify network down to one neuron

Neurons act independently so can scale up process to a network

          w1  +--------------------------+
     x1 ------|               |          |
          w2  | z = w . x + b | a = g(z) |----> ~y
     x2 ------|               |          |
              +--------------------------+

`~y` is our approx/guess of `y`, usually called `ŷ` 'y hat'

`g` is our 'activation' function

# I want to describe a neuron firing

Originally called a [perceptron][6], but later changed to a neuron

Initial code will be for a perceptron, then we'll upgrade to a neuron

Perceptron 'fires' when inputs reach a threshold

                 | 0 if w . x <= threshold
    activation = |
                 | 1 if w . x > threshold

Subtract threshold from both sides and call it 'bias'

    bias = -threshold

                 | 0 if w . x + bias <= 0
    activation = |
                 | 1 if w . x + bias > 0

     a
     ^
    1|     +---+
     |     |
    0| +---+
     +----------> z
           0

## A bit confusing, let's see some code

if then, else...

```javascript
// z = w . x + bias
// a = g(z)
function activation(z) {return (z <= 0) ? 0 : 1;}
// if (z <= 0) return 0; else return 1;
```

Easiest function you can write --> basis for all AI

Someone somewhere is having a laugh

It gets more complex, but all advances are tweaks on this

## I want to multiply two single row / column matrices

Total the inputs using vector dot product / weighted sum

    w . x = [w1 w2]|x1|
                   |x2|

In code a vector is an array / list

```javascript
function dot(w, x) {return w[0] * x[0] + w[1] * x[1];}
```

When scaling to a network change vectors to matrices (2D array)

## Sigmoid neuron

Smooth curved perceptron

       a                 a
       ^                 ^
      1|     +---+      1|        ---+
       |     |           |       /
    1/2|     |        1/2|      /
       |     |           |     /
      0| +---+          0| +---
       +----------> z    +----------> z
             0                  0
# Todo ...
# I want to specify the cost function

Let's meet the the [cross entropy][1] cost function.

The bit we use is the derivative for back-propagation in eqn (61)

<img src="/tex/fb5baf039ce32affc118d796608fdc48.svg?invert_in_darkmode&sanitize=true" align=middle width=237.05711864999995pt height=24.657735299999988pt/>

# To be continued...
# I want to explain why we get bias/over-fitting
Here we loop around our examples just once.
But for more complex problems we loop over the same examples thousands of times.
When you say the same word a thousand times over you start to notice tiny details about the word that aren't relevant.
e.g. conscience, that's actually con-science but that's totally irrelevant.
Neural Networks have no other ideas about the world except for the examples we give them.

# In summary

Generated random set of training and test data that we displayed on a graph for testing

Split the points on the graph using an abritrary line (why? back propagation needs linear separation)

Used a perceptron with an activation function and back propagation algorithm

Trained this perceptron to adjust two weights that then colour the test points depending on which side of the line

This is one step of gradient descent

'Improved' this with a sigmoid activation function and it's differentiated back propagation.


# The end

> implementing it myself from scratch was the most important
> — [Andrej Karpathy talking to Andrew Ng][2] (2018)

...

> What I cannot create, I do not understand.
> — [Richard Feynman][8] (1988)

...

> What you really want is to feel every element (and the connections between them) in your bones.
> — [Michael Nielsen][7] (2019)

Inspired / blatantly copied from:

* [Funfunfunction NN playlist][3]
* [deeplearning.ai week 2][4]
* [NN & DL course][5]

[1]: http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function
[2]: https://www.youtube.com/watch?v=_au3yw46lcg
[3]: https://www.youtube.com/watch?v=anN2Ey37s-o
[4]: https://www.coursera.org/learn/neural-networks-deep-learning/
[5]: http://neuralnetworksanddeeplearning.com
[6]: https://en.wikipedia.org/wiki/Perceptron
[7]: http://cognitivemedium.com/srs-mathematics
[8]: https://en.wikiquote.org/wiki/Richard_Feynman

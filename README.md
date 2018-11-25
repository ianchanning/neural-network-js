# Neural Network for the JavaScript programmer

**The code works but the explantion is Work In Progress**

Let's live code:
* a neural network
* data visualisation

# Where it all goes wrong

Talks that promise 'simple' go bad at slide two

First slide: "This is going to be simple".

Second slide "This isn't simple"

Game Over. Go to step 1.

# Ha! I made it to slide 3

# y = f(x) = 2x

```
 y
 ^
 |
4|  +
3|
2| +
1|
0|+
 +---->x
  012
```

# Mathsy definitions

What's the mathsy name for:

> I've got one set and I want to go to another set?

+-------+      +-------+
| 0 1 2 | ---> | 0 2 4 |
+-------+      +-------+

Mapping!

# f(x) in JavaScript

𝒚 = 𝒇(𝒙) = 2𝒙

```javascript
function f(x) {return 2 * x;}
// could have called it 'double'
// function double(x) {return 2 * x;}
var xs = [0,1,2]; // want output [0,2,4]
var y  = xs.map(f); // [0,2,4]
```

# 2 + 2 + 2

𝒚 = 𝛴 𝒇(𝒙) = 𝛴 2𝒙

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

Stretch (*) and shift (+)

    Rand(0,1) -->  Rand(1,3)

    +-----+        +-----+-----+
    0     1   -->  0     1     2     3
                         +-----+-----+

# Neural Network time

Let's meet the the [cross entropy][1] cost function.

The bit we use is the derivative for back-propagation in eqn (61)

dC/dW_j = 1/n * 𝛴 x_j (s(z)-y)

# To be continued...

[1]: http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function

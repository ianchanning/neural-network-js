# Notes from 3rd attempt at writing from scratch

## Important notes

Trying to follow my slides. 

First problem is that I want to show an overview. I think the skeleton should include the main functions.

Do everything with the mouse!

It took a very long time to generate the points - and that's not the point...

Here's how to generate the slides:

```shell
pandoc -t beamer slides.tex.md -o slides.pdf --pdf-engine
=xelatex
```

Also don't edit the `slides.md`, edit the `slides.tex.md`, the TeXify Github app will update `slides.md`.

### What's my goal?

* Neural Networks aren't that hard? (but they are)
* The core of Neural Networks isn't magic?
* It's functions all the way down
* Keeping the perspective of someone who is new 
* The fundamental steps of Data Science
* Hack at neurons
* Get a fundamental understanding of Neural Networks
* Get the intuition, the mental model
* Respect the code and the maths
* See inside the sausage factory

## Setup / pre-steps

I also need to run `npm install` and install the ESLint plugin for VS Code.

Need to be able to switch from the example to the skeleton quickly - put in an HTML comment to allow switching

First thing that occurs is that all the code for displaying the data isn't that interesting.

* generator - why, want to see the sausage factory and understand the data
* chart - visualizing the data is critical, it's nice to see how easily you can do it with JavaScript
* draw - why is this separate? functional programming baby!
* neuron - this is all we care about

### Tools

I think it's useful to show all the tools that we have at our disposal

* Visual Studio Code <https://code.visualstudio.com>
* Browser tools (F12 in any of Firefox, Chrome, IE) - Console, check that it is picking up the code we want by adding a console.log statement and calling the incorrect function
* Zeal <https://zealdocs.org> - for quick documentation checking
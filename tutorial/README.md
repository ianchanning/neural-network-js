# Tutorial

Main slides: [A ~~Neural Network~~ Perceptron from scratch in JavaScript][1] (pdf).

You can also read the slides [markdown source][2]. It's easier to copy and paste the code from there but they miss the latex formatting.

## TeX slides generation

The slides are written in [pandoc markdown][4] and then generate `slides.pdf` via:

```
pandoc -t beamer slides.tex.md -o slides.pdf --pdf-engine=xelatex
```

The main source is `slides.tex.md` which contain LaTeX that is converted into jpg files using the [TeXify bot][3] and then injected into `slides.md`.

[1]: slides.pdf
[2]: slides.md
[3]: https://github.com/apps/texify
[4]: https://pandoc.org/MANUAL.html#pandocs-markdown

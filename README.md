# A Neural Network from scratch in JavaScript

[![Screenshot](neural-network-screenshot.png)](neural-network-screenshot.png)

## Quickstart

[Download the zip][1], extract and open `index.html`.

The code works but the [tutorial/slides][2] are **primarily complete but pretty alpha**.

## TeX slides generation

The slides are written in [pandoc markdown][4] and then generate `slides.pdf` via:

```sh
pandoc -t beamer slides.tex.md -o slides.pdf --pdf-engine=xelatex
```

The main source is `slides.tex.md` which contain LaTeX that is converted into jpg files using the [TeXify bot][3] and then injected into `slides.md`.

[1]: https://github.com/ianchanning/neural-network-js/archive/master.zip
[2]: tutorial/slides.md
[3]: https://github.com/apps/texify
[4]: https://pandoc.org/MANUAL.html#pandocs-markdown

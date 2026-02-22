---
title: Welcome to Build From Scratch
type: home
date: 2026-02-21
description: To truly understand it, you must build it from scratch.
---

*"To truly understand it, you must build it from scratch."*

This is the core philosophy behind this project. In modern web development, it is incredibly easy to get lost in an ocean of massive libraries, complex frameworks, and magical abstractions. But what happens under the hood? How do the tools we rely on every day actually work?

The absolute best way to demystify complex technology is to break it down to its absolute fundamentals and build it from the ground up. That is exactly what this website is about. Here, we explore complex concepts by stripping away the external dependencies and implementing them using raw, fundamental technologies—like pure HTML, CSS, and vanilla JavaScript.

### Walking the Walk

I don't just talk about building from scratch; I live it. This entire _platform_I mean this website_ is a testament to that philosophy.

There are no massive markdown libraries or heavy third-party syntax highlighting plugins powering these pages. The custom markdown parser seamlessly converting this text into HTML? Built from scratch. The robust, multi-pass, dynamically themed syntax highlighter carefully styling the code blocks? Also built from scratch.

By building my own tooling, I ensure that every single layer of the stack is _fully understood_from top to bottom_, optimized, and tailored precisely for this project.

### What to Expect

Throughout the site, you will find custom `<project-code>` components embedded directly into the articles. These blocks allow you to effortlessly inspect the underlying source code in different file tabs. While not all of them do, many of these elements also feature a **Result** tab, providing a live rendered output that you can interact with!

I already have interactive deep dives on creating **Conway's Game of Life** and exploiting the CSS **`sibling-index()`** function for dynamic layouts without JavaScript.

But the journey is just beginning. In the near future, I will be tackling even more ambitious subjects:
- **Demystifying AI:** I will build a complete, functioning **Neural Network** from scratch to understand the math behind machine learning.
- **Deconstructing UI:** I will strip away the magic of React and Vue by building my very own **Custom Frontend Framework**.

Dive in, explore the source code, and start building!

---

### Highlighting Code
Here is a live example of the custom `<project-code>` web component you'll be using across the site, showcasing the code for our bespoke Regex parser:
[code files="html-parser.js,css-parser.js,js-parser.js,helpers.js" path="/demos/custom-parser/" hide-result="true"]
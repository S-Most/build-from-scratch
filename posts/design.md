---
title: The Hand-Drawn Design
type: project
date: 2026-02-22
description: Welcome to the design overview! This site is built with a minimalist and slightly chaotic aesthetic.
---

Welcome to the design overview! This site is built with a minimalist and slightly chaotic aesthetic. One of the central pillars of this theme is the "sketched" or hand-drawn filter.

## The Sketch Filter

The filter uses SVG and `feTurbulence` with `feDisplacementMap` to deform elements uniquely, making them look somewhat organic and hand-drawn.

```html
<filter id="hand-drawn" x="-8%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
</filter>
```

I applied this filter selectively across the site. You can see them in the horizontal rules, some icons and selected images.

[screenshot.png]

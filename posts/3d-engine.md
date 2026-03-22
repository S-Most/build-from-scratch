---
title: Real-time 3D Graphics Engine
type: project
date: 2026-02-23
description: Implementing a 3D software rasterizer from scratch in JavaScript
---

Three.js is fantastic, and WebGL is unbelievably fast. But parsing `.obj` files, performing perspective projections, and implementing the necessary clipping and back-face culling algorithms yourself is an incredible learning experience.

### The Mathematics of 3D

In this project, we'll construct a 3D graphics rendering pipeline strictly using the HTML5 Canvas 2D API. No WebGL allowed. Every single pixel must be calculated using our own matrix math modules.

We'll start with defining points in 3D space, translating them via transformation matrices, and finally projecting them onto a 2D plane based on our virtual camera's FOV. Once rendering works, we'll dive into flat shading using dot products to calculate lighting based on surface normals.

<hand-quote author="Graphics Wizard">
  A 3D engine is just a very fast loop calculating the intersections of light and geometry.
</hand-quote>

Building a rasterizer from scratch completely demystifies game development pipelines.

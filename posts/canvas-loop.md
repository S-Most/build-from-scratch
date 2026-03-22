---
title: The Canvas Game Loop
type: technique
date: 2026-02-23
description: Handling deterministic state updates and rendering sequences
---

When building interactive games or complex animations in the browser, relying solely on CSS transitions or `setInterval` is not enough. You need a dedicated, frame-synced game loop. In this technique, we explore the anatomy of a robust HTML5 Canvas game loop.

### requestAnimationFrame

The foundation of any good browser game loop is `requestAnimationFrame`. This API tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.

A professional game loop separates logic updates from rendering. Because frame rates can fluctuate (due to heavy processing or device performance), we calculate the "delta time" (time elapsed since the last frame) and update our physics engine deterministically based on that delta, ensuring consistent movement speeds regardless of the frame rate.

Once the state is updated, we clear the canvas context and render the new frame. It's the beating heart of an interactive experience!

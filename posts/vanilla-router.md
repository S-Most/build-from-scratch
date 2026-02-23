---
title: Building a Vanilla JS Router
type: technique
date: 2026-02-23
description: Navigating the History API without external libraries
---

Single Page Applications (SPAs) rely heavily on client-side routing to provide seamless transitions between views without full page reloads. Rather than reaching for `react-router`, we're going to build one from the ground up using the HTML5 History API.

### The Hash vs History Debate

Historically, SPAs used hash routing (`/#/about`) because changing the hash fragment doesn't trigger a page reload. However, the modern standard is the History API, which allows us to manipulate the browser's session history cleanly (`/about`).

Our router will intercept anchor tag clicks, prevent the default behavior, and push the new state onto the history stack using `history.pushState()`. We will also listen for the `popstate` event, which is fired when the user clicks the back or forward buttons.

<hand-quote author="Routing Expert">
  A robust router is just an event listener paired with a cleverly managed mapping object.
</hand-quote>

By understanding the History API, you unlock the secret behind fast, app-like web experiences.

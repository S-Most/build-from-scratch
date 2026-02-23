---
title: Async State Machines
type: technique
date: 2026-02-23
description: Taming complex UI states with finite state machines
---

Modern UI development is state management nightmare. You have loading states, error states, success states, empty states, and transition states. Usually, developers juggle a dozen boolean flags (`isLoading`, `hasError`, `isComplete`), leading to impossible states (like being loading and having an error simultaneously).

### Enter the Finite State Machine (FSM)

An FSM is a mathematical model of computation. It conceives a system as being in exactly one of a finite number of active states at any given time.

By building a lightweight FSM utility in vanilla JavaScript, we can map out our UI flows as explicit graphic models. You define the states, and you define exactly which transitions are legally permissible between those states. If you are in the `loading` state, you can only transition to `success` or `error`. You absolutely cannot transition directly to `fetching_more`.

This technique dramatically reduces bugs and makes complex asynchronous flows incredibly easy to reason about!

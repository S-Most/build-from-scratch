# Conway's Game of Life
A fascinating look at how simple rules can lead to complex behaviors.

## The Rules
The Game of Life is a cellular automaton created by mathematician John Conway. It is a zero-player game, playing out on a grid of cells which can be either alive or dead.

The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells. Every cell interacts with its eight neighbors, which are the cells that are horizontally, vertically, or diagonally adjacent.

At each step in time, the following transitions occur:
- Any live cell with fewer than two live neighbors dies, as if by underpopulation.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any live cell with more than three live neighbors dies, as if by overpopulation.
- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

These simple rules can give rise to endlessly complex patterns!

### Interactive Demo
[code files="index.html,script.js" path="/demos/game-of-life/"]
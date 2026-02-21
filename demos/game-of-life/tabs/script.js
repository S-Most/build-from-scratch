const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stepBtn = document.getElementById('stepBtn');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');

const resolution = 10;
const cols = canvas.width / resolution;
const rows = canvas.height / resolution;

let grid = createGrid();
let playing = false;
let animationId;

function createGrid() {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(0));
}

function randomize() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = Math.random() > 0.85 ? 1 : 0;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = '#333';
                ctx.fillRect(i * resolution + 1, j * resolution + 1, resolution - 2, resolution - 2);
            }
        }
    }
}

function step() {
    let nextGrid = createGrid();
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            let neighbors = countNeighbors(grid, i, j);

            if (state === 0 && neighbors === 3) {
                nextGrid[i][j] = 1;
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = state;
            }
        }
    }
    grid = nextGrid;
    draw();
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / resolution);
    const y = Math.floor((e.clientY - rect.top) / resolution);
    grid[x][y] = grid[x][y] ? 0 : 1;
    draw();
});

startBtn.addEventListener('click', () => {
    playing = !playing;
    startBtn.textContent = playing ? 'Stop' : 'Start';
    if (playing) {
        function play() {
            step();
            animationId = setTimeout(play, 100);
        }
        play();
    } else {
        clearTimeout(animationId);
    }
});

stepBtn.addEventListener('click', () => {
    if (!playing) step();
});

clearBtn.addEventListener('click', () => {
    grid = createGrid();
    draw();
    if (playing) startBtn.click();
});

randomBtn.addEventListener('click', () => {
    randomize();
    draw();
});

randomize();
draw();

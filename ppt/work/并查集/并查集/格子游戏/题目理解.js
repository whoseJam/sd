import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const m = 4;

const grid = new sd.Grid(svg).n(n).m(m);
const circles = sd.make2d(n + 1, m + 1);
const horizontalEdges = sd.make2d(n + 1, m);
const verticalEdges = sd.make2d(n, m + 1);
const fa = sd.make1d((n + 1) * (m + 1) + 10);
let gameOver = false;
let stepCount = 0;

function getId(i, j) {
    return i * (m + 1) + j;
}

function find(x) {
    if (fa[x] === x) return x;
    return (fa[x] = find(fa[x]));
}

function merge(x, y) {
    const fx = find(x);
    const fy = find(y);
    if (fx === fy) return true;
    fa[fx] = fy;
    return false;
}

function initUnionFind() {
    for (let i = 0; i <= (n + 1) * (m + 1); i++) {
        fa[i] = i;
    }
}

function findCycleCells() {
    function hasBarrier(i1, j1, i2, j2) {
        if (i1 === i2) {
            const maxJ = Math.max(j1, j2);
            if (maxJ < 0 || maxJ > m || i1 < 0 || i1 >= n) return false;
            return verticalEdges[i1]?.[maxJ]?.clicked || false;
        } else {
            const maxI = Math.max(i1, i2);
            if (maxI < 0 || maxI > n || j1 < 0 || j1 >= m) return false;
            return horizontalEdges[maxI]?.[j1]?.clicked || false;
        }
    }

    const outside = sd.make2d(n + 2, m + 2);
    const queue = [[-1, -1]];
    outside[0][0] = true;

    while (queue.length > 0) {
        const [i, j] = queue.shift();
        const neighbors = [
            [i - 1, j],
            [i + 1, j],
            [i, j - 1],
            [i, j + 1],
        ];

        for (const [ni, nj] of neighbors) {
            const ei = ni + 1;
            const ej = nj + 1;
            if (ei >= 0 && ei < n + 2 && ej >= 0 && ej < m + 2 && !outside[ei][ej]) {
                if (!hasBarrier(i, j, ni, nj)) {
                    outside[ei][ej] = true;
                    queue.push([ni, nj]);
                }
            }
        }
    }

    const cells = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (!outside[i + 1][j + 1]) {
                cells.push([i, j]);
            }
        }
    }
    return cells;
}

function traceCycleBoundary(cells) {
    if (cells.length === 0) return null;

    const cellSet = new Set(cells.map(([i, j]) => `${i},${j}`));
    const adjacency = new Map();

    function addEdge(r1, c1, r2, c2) {
        const key1 = `${r1},${c1}`;
        const key2 = `${r2},${c2}`;
        if (!adjacency.has(key1)) adjacency.set(key1, []);
        if (!adjacency.has(key2)) adjacency.set(key2, []);
        adjacency.get(key1).push({ r: r2, c: c2 });
        adjacency.get(key2).push({ r: r1, c: c1 });
    }

    for (const [i, j] of cells) {
        if (!cellSet.has(`${i - 1},${j}`) && horizontalEdges[i]?.[j]?.clicked) {
            addEdge(i, j, i, j + 1);
        }
        if (!cellSet.has(`${i + 1},${j}`) && horizontalEdges[i + 1]?.[j]?.clicked) {
            addEdge(i + 1, j, i + 1, j + 1);
        }
        if (!cellSet.has(`${i},${j - 1}`) && verticalEdges[i]?.[j]?.clicked) {
            addEdge(i, j, i + 1, j);
        }
        if (!cellSet.has(`${i},${j + 1}`) && verticalEdges[i]?.[j + 1]?.clicked) {
            addEdge(i, j + 1, i + 1, j + 1);
        }
    }

    if (adjacency.size === 0) return null;

    const startKey = adjacency.keys().next().value;
    const [startR, startC] = startKey.split(",").map(Number);
    const path = [];
    const visited = new Set();
    let current = { r: startR, c: startC };
    let prev = null;

    while (true) {
        const currentKey = `${current.r},${current.c}`;
        path.push(current);
        visited.add(currentKey);

        const neighbors = adjacency.get(currentKey) || [];
        let next = null;

        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.r},${neighbor.c}`;
            if (neighborKey === startKey && path.length > 2) return path;
            if (prev && neighbor.r === prev.r && neighbor.c === prev.c) continue;
            if (!visited.has(neighborKey)) {
                next = neighbor;
                break;
            }
        }

        if (!next) {
            for (const neighbor of neighbors) {
                if (`${neighbor.r},${neighbor.c}` === startKey) return path;
            }
            break;
        }

        prev = current;
        current = next;
        if (path.length > adjacency.size * 2) break;
    }

    return path.length > 2 ? path : null;
}

function handleCycleDetected(cells) {
    gameOver = true;

    for (const [ci, cj] of cells) {
        const rect = new sd.Rect(svg)
            .x(grid.x() + grid.elementWidth() * cj)
            .y(grid.y() + grid.elementHeight() * ci)
            .width(grid.elementWidth())
            .height(grid.elementHeight())
            .fill(C.blue)
            .fillOpacity(0)
            .strokeOpacity(0);
        rect.startAnimate().fillOpacity(0.3).endAnimate();
    }

    const boundaryPath = traceCycleBoundary(cells);
    if (boundaryPath && boundaryPath.length > 0) {
        const pen = new sd.PathPen();
        pen.MoveTo(
            grid.x() + grid.elementWidth() * boundaryPath[0].c,
            grid.y() + grid.elementHeight() * boundaryPath[0].r
        );
        for (let k = 1; k < boundaryPath.length; k++) {
            pen.LineTo(
                grid.x() + grid.elementWidth() * boundaryPath[k].c,
                grid.y() + grid.elementHeight() * boundaryPath[k].r
            );
        }
        pen.ClosePath();

        const path = new sd.Path(svg).d(pen.toString()).fillOpacity(0).stroke(C.gold).strokeWidth(3);
        path.startAnimate().pointStoT().endAnimate();
    }
}

sd.init(() => {
    grid.width(400).height(400).cx(600).cy(250);
    initUnionFind();

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            const circle = new sd.Circle(svg).r(5).color(C.BLUE);
            circle.cx(grid.x() + grid.elementWidth() * j);
            circle.cy(grid.y() + grid.elementHeight() * i);
            circles[i][j] = circle;
        }
    }

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j < m; j++) {
            const line = new sd.Line(svg)
                .source(circles[i][j].cx(), circles[i][j].cy())
                .target(circles[i][j + 1].cx(), circles[i][j + 1].cy())
                .stroke(C.gray)
                .strokeWidth(12)
                .opacity(0.3);

            line.clicked = false;
            line.onClick(() => {
                if (gameOver || line.clicked) return;
                sd.inter(() => {
                    line.clicked = true;
                    stepCount++;
                    line.startAnimate().stroke(C.red).opacity(1).strokeWidth(12).endAnimate();

                    if (merge(getId(i, j), getId(i, j + 1))) {
                        handleCycleDetected(findCycleCells());
                    }
                });
            });
            horizontalEdges[i][j] = line;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= m; j++) {
            const line = new sd.Line(svg)
                .source(circles[i][j].cx(), circles[i][j].cy())
                .target(circles[i + 1][j].cx(), circles[i + 1][j].cy())
                .stroke(C.gray)
                .strokeWidth(12)
                .opacity(0.3);

            line.clicked = false;
            line.onClick(() => {
                if (gameOver || line.clicked) return;
                sd.inter(() => {
                    line.clicked = true;
                    stepCount++;
                    line.startAnimate().stroke(C.red).opacity(1).strokeWidth(12).endAnimate();

                    if (merge(getId(i, j), getId(i + 1, j))) {
                        handleCycleDetected(findCycleCells());
                    }
                });
            });
            verticalEdges[i][j] = line;
        }
    }
});

sd.main(async () => {
    await sd.pause();
});

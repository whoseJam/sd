import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const MINH = 0;
const MAXH = 80;
const R = 25;

new sd.Rect(svg)
    .x(0)
    .y(MINH)
    .width(300)
    .height(MAXH - MINH)
    .fill(C.yellow)
    .fillOpacity(0.15)
    .strokeWidth(0);

const upper = new sd.Line(svg).source(0, 0).target(300, 0).strokeWidth(2).stroke(C.grey);
const lower = new sd.Line(svg).source(0, 80).target(300, 80).strokeWidth(2).stroke(C.grey);

for (let x = 0; x <= 300; x += 8) {
    new sd.Line(svg)
        .source(x, MINH)
        .target(x - 5, MINH + 5)
        .strokeWidth(1.5)
        .stroke(C.grey);
}

for (let x = 0; x <= 300; x += 8) {
    new sd.Line(svg)
        .source(x, MAXH)
        .target(x + 5, MAXH - 5)
        .strokeWidth(1.5)
        .stroke(C.grey);
}

const data = [
    [120, 20],
    [180, 50],
    [80, 70],
    [240, 30],
    [200, 70],
    [160, 40],
    [60, 50],
    [100, 40],
];

const nodes = sd.make1d(data.length);
const lines = [];

const n = data.length;
const TOP = n;
const BOTTOM = n + 1;
const parent = sd.make1d(n + 2);
const graph = [];

function find(x) {
    if (parent[x] !== x) {
        parent[x] = find(parent[x]);
    }
    return parent[x];
}

function union(x, y) {
    const px = find(x);
    const py = find(y);
    if (px !== py) {
        parent[px] = py;
        graph.push([x, y]);
    }
}

function dist(x1, x2, y1, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function findPath() {
    const topNodes = [];
    const bottomNodes = [];
    for (let i = 0; i < n; i++) {
        if (find(i) === find(BOTTOM)) {
            const [xa, ya] = data[i];
            if (ya - R <= MINH) topNodes.push(i);
            if (ya + R >= MAXH) bottomNodes.push(i);
        }
    }
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of graph) {
        if (u < n && v < n) {
            adj[u].push(v);
            adj[v].push(u);
        }
    }
    for (const start of bottomNodes) {
        const queue = [[start]];
        const visited = new Set([start]);

        while (queue.length > 0) {
            const path = queue.shift();
            const curr = path[path.length - 1];

            if (topNodes.includes(curr)) {
                return path;
            }

            for (const next of adj[curr]) {
                if (!visited.has(next)) {
                    visited.add(next);
                    queue.push([...path, next]);
                }
            }
        }
    }
    return [];
}

sd.init(() => {
    for (let i = 0; i < n + 2; i++) {
        parent[i] = i;
    }
});

sd.main(async () => {
    await sd.pause();

    for (let i = 0; i < data.length; i++) {
        const [x, y] = data[i];
        const circle = new sd.Circle(svg).r(0).cx(x).cy(y).color(C.BLUE).fillOpacity(0.3);
        circle
            .after(i * 150)
            .startAnimate()
            .r(R)
            .endAnimate();
        nodes[i] = circle;
    }

    await sd.pause();

    let lineIndex = 0;

    for (let i = 0; i < data.length; i++) {
        const [xa, ya] = data[i];

        if (ya + R >= MAXH) {
            const line = new sd.Line(svg).source(xa, ya).target(xa, MAXH).strokeWidth(2).stroke(C.ORANGE).opacity(0);
            line.after(lineIndex * 200)
                .opacity(1)
                .startAnimate()
                .pointStoT()
                .endAnimate();
            lines.push(line);
            lineIndex++;
            union(i, BOTTOM);
        }
        if (ya - R <= MINH) {
            const line = new sd.Line(svg).source(xa, ya).target(xa, MINH).strokeWidth(2).stroke(C.ORANGE).opacity(0);
            line.after(lineIndex * 200)
                .opacity(1)
                .startAnimate()
                .pointStoT()
                .endAnimate();
            lines.push(line);
            lineIndex++;
            union(i, TOP);
        }
    }

    for (let i = 0; i < data.length; i++) {
        const [xa, ya] = data[i];
        for (let j = i + 1; j < data.length; j++) {
            const [xb, yb] = data[j];
            if (dist(xa, xb, ya, yb) <= R + R) {
                const line = new sd.Line(svg).source(xa, ya).target(xb, yb).strokeWidth(2).stroke(C.ORANGE).opacity(0);
                line.after(lineIndex * 200)
                    .opacity(1)
                    .startAnimate()
                    .pointStoT()
                    .endAnimate();
                lines.push(line);
                lineIndex++;
                union(i, j);
            }
        }
    }

    await sd.pause();

    if (find(TOP) === find(BOTTOM)) {
        const path = findPath();
        if (path.length > 0) {
            for (let i = 0; i < path.length; i++) {
                nodes[path[i]]
                    .after(i * 150)
                    .startAnimate()
                    .color(C.GREEN)
                    .endAnimate();
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            nodes[i].startAnimate().color(C.RED).fillOpacity(0.5).endAnimate();
        }
    }
});

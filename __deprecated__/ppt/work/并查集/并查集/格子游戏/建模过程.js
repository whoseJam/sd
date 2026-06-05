import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 3;
const m = 3;

const grid = new sd.Grid(svg).n(n).m(m);
const frontLayer = svg.append("g");
const circles = sd.make2d(n + 1, m + 1);
const fa = sd.make1d((n + 1) * (m + 1) + 10);

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

async function connectEdge(i1, j1, i2, j2) {
    await sd.pause();
    const id1 = getId(i1, j1);
    const id2 = getId(i2, j2);
    circles[i1][j1].startAnimate().r(10).fill(C.orange).endAnimate();
    circles[i2][j2].startAnimate().r(10).fill(C.orange).endAnimate();
    const cx1 = circles[i1][j1].cx();
    const cy1 = circles[i1][j1].cy();
    const cx2 = circles[i2][j2].cx();
    const cy2 = circles[i2][j2].cy();
    const line = new sd.Line(frontLayer).source(cx1, cy1).target(cx2, cy2).stroke(C.red).strokeWidth(6).opacity(0);
    line.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    const hasCycle = merge(id1, id2);
    if (hasCycle) {
        line.startAnimate().stroke(C.gold).strokeWidth(8).endAnimate();
        circles[i1][j1].startAnimate().r(12).fill(C.gold).endAnimate();
        circles[i2][j2].startAnimate().r(12).fill(C.gold).endAnimate();
    } else line.startAnimate().stroke(C.green).endAnimate();
    if (!hasCycle) {
        await sd.pause();
        circles[i1][j1].startAnimate().r(6).fill(C.blue).endAnimate();
        circles[i2][j2].startAnimate().r(6).fill(C.blue).endAnimate();
    }
}

sd.init(() => {
    grid.width(400).height(400).cx(600).cy(300);
    initUnionFind();

    const positions = sd.make2d(n + 1, m + 1);
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            positions[i][j] = {
                x: grid.x() + grid.elementWidth() * j,
                y: grid.y() + grid.elementHeight() * i,
            };
        }
    }

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j < m; j++) {
            new sd.Line(frontLayer)
                .source(positions[i][j].x, positions[i][j].y)
                .target(positions[i][j + 1].x, positions[i][j + 1].y)
                .stroke(C.gray)
                .strokeWidth(2)
                .opacity(0.3);
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= m; j++) {
            new sd.Line(frontLayer)
                .source(positions[i][j].x, positions[i][j].y)
                .target(positions[i + 1][j].x, positions[i + 1][j].y)
                .stroke(C.gray)
                .strokeWidth(2)
                .opacity(0.3);
        }
    }

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            const circle = new sd.Circle(svg).r(6).fill(C.blue).stroke(C.BLUE).strokeWidth(2);
            circle.cx(positions[i][j].x);
            circle.cy(positions[i][j].y);
            circles[i][j] = circle;
        }
    }
});

sd.main(async () => {
    await sd.pause();
    await connectEdge(1, 1, 1, 2);
    await connectEdge(1, 2, 2, 2);
    await connectEdge(2, 2, 2, 1);
    await connectEdge(0, 0, 1, 0);
    await connectEdge(1, 0, 1, 1);
    await connectEdge(3, 3, 3, 2);
    await connectEdge(3, 2, 2, 2);
    await connectEdge(0, 3, 0, 2);
    await connectEdge(0, 2, 1, 2);
    await connectEdge(2, 0, 3, 0);
    await connectEdge(3, 0, 3, 1);
    await connectEdge(3, 1, 2, 1);
    await connectEdge(0, 1, 1, 1);
    await connectEdge(1, 0, 2, 0);
});

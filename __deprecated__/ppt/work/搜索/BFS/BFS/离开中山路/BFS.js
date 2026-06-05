import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 3;
const [sx, sy] = [1, 1];
const tree = new sd.ValueTree(svg).width(400).layerHeight(80);
const memory = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
const Q = new sd.ValueArray(svg).elementWidth(60);
const directions = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
];
const focus = sd.Focus(svg);
const treeFocus = sd.Focus(tree);
const map = I.readIntMatrix(`0 1 0 0 0 0 0 0 0`, n, n);
const nodes = sd.make2d(n + 5, n + 5);

sd.init(() => {
    tree.mx(memory.x() - 50).y(memory.y());
    bfsSync(sx, sy);
    Q.x(tree.cx()).y(tree.my() + 60);
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
    sd.Label(Q, "队列");
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) memory.color(i, j, C.grey);
        }
});

sd.main(async () => {
    await bfs(sx, sy);
});

function bfsSync() {
    let tot = 0;
    const visited = sd.make2d(n + 1, n + 1, false);
    visited[sx][sy] = 0;
    tree.newNode(++tot, makeGrid(sx, sy));
    const queue = [[sx, sy, tot]];
    nodes[sx][sy] = tree.element(1);
    while (queue.length > 0) {
        const [x, y, current] = queue.shift();
        for (const [dx, dy] of directions) {
            const [tx, ty] = [x + dx, y + dy];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= n && map[tx][ty] === 0 && visited[tx][ty] === false) {
                visited[tx][ty] = visited[x][y] + 1;
                const next = ++tot;
                tree.newNode(next, makeGrid(tx, ty));
                tree.element(next).current = [tx, ty];
                tree.newLink(current, next);
                queue.push([tx, ty, next]);
                nodes[tx][ty] = tree.element(next);
            }
        }
    }
}

async function bfs() {
    let tot = 0;
    const visited = sd.make2d(n + 1, n + 1, false);
    visited[sx][sy] = 0;
    await sd.pause();
    Q.startAnimate().push(makeGrid(sx, sy)).endAnimate();
    memory.startAnimate().value(sx, sy, 0).endAnimate();
    const queue = [[sx, sy, tot]];
    while (queue.length > 0) {
        await sd.pause();
        const first = Q.element(0);
        focus.startAnimate().focus(first).endAnimate();
        const [x, y, current] = queue.shift();
        treeFocus.startAnimate().focus(nodes[x][y]).endAnimate();
        for (const [dx, dy] of directions) {
            const [tx, ty] = [x + dx, y + dy];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= n) {
                const color = map[tx][ty] === 0 && visited[tx][ty] === false ? C.green : C.red;
                await sd.pause();
                const link = new sd.Line(svg)
                    .stroke(color)
                    .source(memory.element(x + 0, y).center())
                    .target(memory.element(tx, ty).center())
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
                if (map[tx][ty] === 0 && visited[tx][ty] === false) {
                    await sd.pause();
                    visited[tx][ty] = visited[x][y] + 1;
                    queue.push([tx, ty, current + 1]);
                    memory
                        .startAnimate()
                        .value(tx, ty, current + 1)
                        .endAnimate();
                    Q.startAnimate().push(makeGrid(tx, ty)).endAnimate();
                    const father = nodes[x][y];
                    const child = nodes[tx][ty];
                    const link = tree.element(father, child);
                    link.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
                    child.startAnimate().opacity(1).endAnimate();
                }
                await sd.pause();
                link.startAnimate().fadeStoT().endAnimate().remove();
            }
        }
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
        treeFocus.startAnimate().focus(null).endAnimate();
        Q.startAnimate().erase(0).endAnimate();
    }
}

function makeGrid(x, y) {
    const grid = new sd.Grid(svg).elementWidth(15).elementHeight(15).n(n).m(n).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) grid.color(i, j, C.grey);
        }
    grid.value(x, y, new sd.Circle(grid).color(C.orange));
    return grid;
}

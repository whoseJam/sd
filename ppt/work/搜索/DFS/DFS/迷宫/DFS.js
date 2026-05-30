import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const EN = sd.enter();
const tree = new sd.BoxTree(svg).width(1400).elementWidth(80).elementHeight(30).layerHeight(120);
const movingGrid = new sd.Grid(svg).elementWidth(20).elementHeight(20).startN(1).startM(1);
const n = 3;
const [sx, sy] = [1, 1];
const [fx, fy] = [3, 3];
const visited = sd.make2d(n + 1, n + 1);
const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];
const map = I.readIntMatrix(`0 0 1 0 0 0 1 0 0`, n, n);
let tot = 0;

sd.init(() => {
    visited[sx][sy] = 1;
    dfs(sx, sy);
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
    movingGrid.n(n).m(n);
    movingGrid.value(sx, sy, new sd.Circle(svg).color(C.orange));
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) movingGrid.value(i, j, 1);
        }
    }
    movingGrid.color(sx, sy, C.grey);
    moveCurrent(tree.element(1));
});

sd.main(async () => {
    await dfsNode(1);
});

function moveCurrent(element) {
    movingGrid.my(element.y() - 10).cx(element.cx());
}

async function dfsNode(a) {
    const element = tree.element(a);
    const children = tree.children(element);
    const [x, y] = element.current;
    for (const child of children) {
        await sd.pause();
        const link = tree.element(a, child);
        const [nx, ny] = link.next;
        movingGrid.startAnimate();
        moveCurrent(child);
        movingGrid.value(nx, ny, movingGrid.dropValue(x, y).onEnter(EN.moveTo()));
        movingGrid.color(nx, ny, C.grey);
        movingGrid.endAnimate();
        link.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        child.startAnimate().opacity(1).childAs(makeGrid(nx, ny), R.aside("rt")).endAnimate();

        await dfsNode(tree.nodeId(child));

        await sd.pause();
        movingGrid.startAnimate();
        moveCurrent(element);
        movingGrid.value(x, y, movingGrid.dropValue(nx, ny).onEnter(EN.moveTo()));
        movingGrid.color(nx, ny, C.white);
        movingGrid.endAnimate();
    }
    if (tree.children(element).length === 0) {
        await sd.pause();
        element
            .startAnimate()
            .color(x === fx && y === fy ? C.orange : C.red)
            .endAnimate();
    }
}

function dfs(x, y) {
    const current = ++tot;
    tree.newNode(current, `D(${x},${y})`);
    tree.element(current).current = [x, y];
    if (x === fx && y === fy) return current;
    let v;
    for (const [dx, dy] of directions) {
        const [tx, ty] = [x + dx, y + dy];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= n && map[tx][ty] === 0 && !visited[tx][ty]) {
            visited[tx][ty] = 1;
            tree.newLink(current, (v = dfs(tx, ty)));
            tree.element(current, v).next = [tx, ty];
            visited[tx][ty] = 0;
        }
    }
    return current;
}

function makeGrid(x, y) {
    const grid = new sd.Grid(svg).elementWidth(15).elementHeight(15).n(n).m(n).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (movingGrid.color(i, j).fill === C.grey) grid.color(i, j, C.grey);
            if (map[i][j]) grid.value(i, j, "1");
        }
    grid.value(x, y, new sd.Circle(grid).color(C.orange));
    return grid;
}

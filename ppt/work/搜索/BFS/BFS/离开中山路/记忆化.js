import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const EN = sd.enter();
const tree = new sd.ValueTree(svg).width(1400).layerHeight(120);
const n = 3;
const [sx, sy] = [1, 1];
const [fx, fy] = [1, 3];
const visited = sd.make2d(n + 1, n + 1);
const directions = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
];
const map = I.readIntMatrix(`0 1 0 0 0 0 0 0 0`, n, n);
let tot = 0;

sd.init(() => {
    visited[sx][sy] = 1;
    dfs(sx, sy);
});

sd.main(async () => {
    await sd.pause();
    const strokeWidth = 5;
    let current = [1];
    let next = [];
    sd.Focus(tree).strokeWidth(strokeWidth).startAnimate().focus(1).endAnimate();
    while (current.length > 0) {
        await sd.pause();
        for (const x of current) {
            const children = tree.children(x);
            for (const child of children) {
                if (visited[child.current[0]][child.current[1]]) continue;
                sd.Focus(child).strokeWidth(strokeWidth).startAnimate().focus().endAnimate();
                visited[child.current[0]][child.current[1]] = 1;
                const link = tree.element(x, child);
                link.startAnimate().strokeWidth(strokeWidth).stroke(C.red).endAnimate();
                next.push(+tree.nodeId(child));
            }
        }
        [current, next] = [next, []];
    }
});

function dfs(x, y) {
    const current = ++tot;
    tree.newNode(current, makeGrid(x, y));
    tree.element(current).current = [x, y];
    if (x === fx && y === fy) return current;
    let v;
    for (const [dx, dy] of directions) {
        const [tx, ty] = [x + dx, y + dy];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= n && map[tx][ty] === 0 && !visited[tx][ty]) {
            visited[tx][ty] = 1;
            tree.newLink(current, (v = dfs(tx, ty)));
            tree.element(current, v).arrow();
            tree.element(current, v).next = [tx, ty];
            visited[tx][ty] = 0;
        }
    }
    return current;
}

function makeGrid(x, y) {
    const grid = new sd.Grid(svg).elementWidth(30).elementHeight(30).n(n).m(n).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (visited[i][j]) grid.color(i, j, C.grey);
            if (map[i][j]) grid.value(i, j, "#");
        }
    grid.value(x, y, new sd.Circle(grid).color(C.orange));
    return grid;
}

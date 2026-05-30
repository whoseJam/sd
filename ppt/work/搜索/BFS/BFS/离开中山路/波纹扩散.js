import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const EN = sd.enter();
const grad = C.gradient(C.textBlue, C.white, 0, 10);
const n = 6;
const [sx, sy] = [1, 1];
const visited = sd.make2d(n + 1, n + 1, false);
const memory = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
const directions = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
];
const map = I.readIntMatrix(`0 1 0 0 0 0 0 0 0 1 0 0 1 0 0 0 0 0 0 0 1 0 1 0 0 0 0 0 0 1`, n, n);

sd.init(() => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) memory.color(i, j, C.grey);
        }
});

sd.main(async () => {
    await bfs(sx, sy);
});

async function bfs() {
    await sd.pause();
    memory.startAnimate().value(sx, sy, 0).color(sx, sy, grad(0)).endAnimate();
    visited[sx][sy] = 0;
    const queue = [[sx, sy, 0]];
    await sd.pause();
    memory.startAnimate();
    while (queue.length > 0) {
        const [x, y, current] = queue.shift();
        for (const [dx, dy] of directions) {
            const [tx, ty] = [x + dx, y + dy];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= n) {
                if (map[tx][ty] === 0 && visited[tx][ty] === false) {
                    visited[tx][ty] = visited[x][y] + 1;
                    queue.push([tx, ty, current + 1]);
                    memory.value(tx, ty, current + 1).color(tx, ty, grad(current + 1));
                }
            }
        }
        if (queue.length > 0 && queue[0][2] !== current) {
            memory.endAnimate();
            await sd.pause();
            memory.startAnimate();
        }
    }
}

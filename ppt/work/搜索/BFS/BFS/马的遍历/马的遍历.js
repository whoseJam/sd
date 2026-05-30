import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 6;
const m = 5;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const grad = C.gradient(C.blue, C.deepSkyBlue, 0, 10);
const focus = sd.Focus(grid);
const dx = [2, 2, 1, 1, -1, -1, -2, -2];
const dy = [1, -1, 2, -2, 2, -2, 1, -1];

sd.init(() => {
    grid.color(1, 1, grad(0));
    grid.value(1, 1, 0);
    grid.cx(600).cy(300);
});

sd.main(async () => {
    const Q = [{ x: 1, y: 1 }];
    while (Q.length > 0) {
        const u = Q[0];
        Q.shift();
        await sd.pause();
        focus.startAnimate().focus(u.x, u.y).endAnimate();
        for (let i = 0; i < 8; i++) {
            const tx = u.x + dx[i];
            const ty = u.y + dy[i];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= m) {
                if (!grid.value(tx, ty)) {
                    await sd.pause();
                    grid.startAnimate();
                    const w = grid.intValue(u.x, u.y) + 1;
                    grid.value(tx, ty, w);
                    grid.color(tx, ty, grad(w));
                    grid.endAnimate();
                    Q.push({ x: tx, y: ty });
                }
            }
        }
    }
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const m = 9;
const dx = [1, 1, 2, 2, -1, -1, -2, -2, 0];
const dy = [2, -2, 1, -1, 2, -2, 1, -1, 0];
const cx = 3;
const cy = 5;
const mp = new sd.Grid(svg).startN(1).startM(1).n(n).m(m);

sd.init(() => {
    for (let i = 0; i < 9; i++) {
        let tx = cx + dx[i];
        let ty = cy + dy[i];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= m) mp.value(tx, ty, new sd.Circle(svg).color(C.ORANGE));
    }
});

sd.main(async () => {});

import * as sd from "@/sd";

const C = sd.color();
const svg = sd.svg();
const g = new sd.Grid(svg);
const n = 4;
const m = 5;
g.n(n).startN(1).m(m).startM(1);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(g, "i", "r").startAnimate().moveTo(2, 1).endAnimate();
    sd.Pointer(g, "j").startAnimate().moveTo(1, 2).endAnimate();
    sd.Focus(g).startAnimate().focus(2, 2).endAnimate();
});

function color(x, y, lx, ly, c) {
    for (let i = x; i <= lx + x - 1; i++) {
        for (let j = y; j <= ly + y - 1; j++) {
            g.color(i, j, c);
        }
    }
}

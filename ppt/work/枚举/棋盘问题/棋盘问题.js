import * as sd from "@/sd";

const C = sd.color();
const svg = sd.svg();
const g = new sd.Grid(svg);
const n = 4;
const m = 5;
g.n(n).startN(1).m(m).startM(1);

sd.init(() => {});

sd.main(async () => {
    const f1 = sd.Focus(g);
    const f2 = sd.Focus(g);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            for (let x = i; x <= n; x++) {
                for (let y = j; y <= m; y++) {
                    console.log("i=", i, "j=", j);
                    await sd.pause();
                    g.startAnimate();
                    g.color(C.white);
                    color(i, j, x - i + 1, y - j + 1, C.blue);
                    f1.focus(i, j);
                    f2.focus(x, y);
                    g.endAnimate();
                }
            }
        }
    }
});

function color(x, y, lx, ly, c) {
    for (let i = x; i <= lx + x - 1; i++) {
        for (let j = y; j <= ly + y - 1; j++) {
            g.color(i, j, c);
        }
    }
}

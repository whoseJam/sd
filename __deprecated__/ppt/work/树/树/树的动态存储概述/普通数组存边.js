import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const t = new sd.Tree(svg).x(500).y(100);
const g = new sd.Grid(svg);
const cnt = sd.make1d(20);

sd.init(() => {
    function getRandomInt(l, r) {
        return Math.floor(Math.random() * (r - l + 1)) + l;
    }
    g.n(n).m(n).startN(1).startM(1).x(100).y(100);
    t.root(1);
    sd.Index(g, "l");
    sd.Index(g, "t");
    for (let i = 2; i <= n; i++) {
        let f = getRandomInt(1, i - 1);
        cnt[f]++;
        g.value(f, cnt[f], i);
        t.link(f, i);
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (cnt[i] >= j) g.color(i, j, C.blue);
            else g.color(i, j, C.grey);
        }
    }
});

sd.main(async () => {});

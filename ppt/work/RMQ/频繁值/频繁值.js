import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(40).y(40).start(1);
const sum = new sd.Array(svg).x(40).y(100);
const lpos = new sd.Array(svg).x(40).y(160);
const rpos = new sd.Array(svg).x(40).y(220);
const data = [-1, -1, -1, -1, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 6, 6, 6, 6];
const brace = sd.Brace(arr).braceGap(20).value("query");

sd.Label(arr, "原始序列", "lc");
sd.Label(sum, "sum", "lc");
sd.Label(lpos, "l", "lc");
sd.Label(rpos, "r", "lc");
sd.Index(arr, "t");

sd.init(() => {
    data.forEach(d => arr.push(d));
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && data[r + 1] === data[l]) r++;
        for (let i = l; i <= r; i++) {
            lpos.push(l + 1);
            rpos.push(r + 1);
            sum.push(r - l + 1);
        }
    }
    lpos.opacity(0);
    rpos.opacity(0);
    sum.opacity(0);
});

sd.main(async () => {
    await sd.pause();
    brace.startAnimate().brace(5, 14).endAnimate();
    await sd.pause();
    for (let i = 1; i < data.length; i++) {
        if (data[i] !== data[i - 1]) {
            const x = arr.element(i + 1).x();
            new sd.Line(svg)
                .source(x, arr.y() - 10)
                .target(x, rpos.my() + 10)
                .stroke(C.red)
                .strokeWidth(2)
                .startAnimate()
                .pointStoT()
                .endAnimate();
        }
    }
    sum.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    brace.startAnimate().opacity(0).endAnimate();
    await sd.pause();
    brace.startAnimate().brace(10, 17).endAnimate();
    await sd.pause();
    lpos.startAnimate().opacity(1).endAnimate();
    rpos.startAnimate().opacity(1).endAnimate();
});

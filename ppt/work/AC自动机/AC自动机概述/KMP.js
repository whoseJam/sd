import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const str = " abbabaab";
const n = str.length - 1;
const arr = new sd.Array(svg);
const nxt = sd.make1d(20);
const links = [];
const bf = sd.Brace(arr);
const bb = sd.Brace(arr);

sd.init(() => {
    for (let i = 0; i <= n; i++) arr.push(str[i]);
    for (let i = 0; i <= n; i++) {
        arr.element(i).childAs(new sd.Text(svg, i).fontSize(12), R.aside("bc", 3));
        if (i >= 1) {
            const idx = i;
            arr.element(idx).onClick(() => {
                sd.inter(async () => {
                    arr.startAnimate().color(idx, C.blue).endAnimate();
                    links[idx - 1].after(arr).startAnimate().stroke(C.red).endAnimate();
                    arr.after(links[idx - 1])
                        .startAnimate()
                        .color(nxt[idx], C.blue)
                        .endAnimate();
                    bf.after(arr).startAnimate().brace(1, nxt[idx], "b", 20).endAnimate();
                    bb.after(arr)
                        .startAnimate()
                        .brace(idx - nxt[idx] + 1, idx, "b", 20)
                        .endAnimate();
                    await sd.pause();
                    links[idx - 1].startAnimate().stroke(C.black).endAnimate();
                    bf.startAnimate().opacity(0).endAnimate();
                    bb.startAnimate().opacity(0).endAnimate();
                    arr.startAnimate().color(C.white).endAnimate();
                });
            });
        }
    }
    prepare();
    arr.x(100).cy(300);
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    for (let i = 1; i <= n; i++) {
        links.push(new sd.Curve(svg).target(arr.element(i).pos("cx", "y")).source(arr.element(nxt[i]).pos("cx", "y")).bending(-0.5).startAnimate().pointTtoS().endAnimate().revArrow());
    }
});

function prepare() {
    nxt[1] = 0;
    let cur = 0;
    for (let i = 2; i <= n; i++) {
        while (cur && str[cur + 1] !== str[i]) cur = nxt[cur];
        if (str[cur + 1] === str[i]) nxt[i] = ++cur;
    }
}

import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const arr = new sd.Array(svg).resize(n);
const node = sd.make1d(n);
const gap = 12;
const H = 7;

sd.init(() => {
    sd.Brace(arr)
        .brace(0, n - 1, "b")
        .value("n堆石子");
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    arr.forEachElement((element, id) => {
        const rect = new sd.Rect(svg)
            .width(30)
            .height(H)
            .cx(element.cx())
            .my(arr.y() - gap)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        node[id] = rect;
    });
    arr.forEachElement((element, id) => {
        element.onClick(() => {
            let i = id + 1;
            while (i < node.length && node[i] === node[id]) i++;
            if (i === node.length) return;
            sd.inter(async () => {
                const i1 = getInterval(id);
                const i2 = getInterval(i);
                const lc = node[i1[0]];
                const rc = node[i2[0]];
                const y = Math.min(lc.y(), rc.y());
                const fa = new sd.Rect(svg)
                    .width((i2[1] - i1[0] + 1) * 40 - 10)
                    .height(H)
                    .cx((arr.element(i1[0]).cx() + arr.element(i2[1]).cx()) / 2)
                    .my(y - gap)
                    .opacity(0)
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
                fa.lc = lc;
                fa.rc = rc;
                merge(fa);
                sd.Link(fa, lc, sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate();
                sd.Link(fa, rc, sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate();
                for (let k = i1[0]; k <= i2[1]; k++) node[k] = fa;
            });
        });
    });
});

function getInterval(x) {
    let l = x;
    let r = x;
    while (l - 1 >= 0 && node[l - 1] === node[x]) l--;
    while (r + 1 < node.length && node[r + 1] === node[x]) r++;
    return [l, r];
}

function merge(u) {
    if (u.lc) {
        u.lc.startAnimate();
        u.lc.y(u.my() + gap);
        u.lc.endAnimate();
        merge(u.lc);
    }
    if (u.rc) {
        u.rc.startAnimate();
        u.rc.y(u.my() + gap);
        u.rc.endAnimate();
        merge(u.rc);
    }
}

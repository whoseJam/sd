import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 4;
const m = 6;
const a = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const focus = sd.Focus(a);

sd.init(() => {
    sd.Label(a, "d");
    a.forEachElement(element => {
        element.childAs("cover", new sd.Rect(svg).color(C.orange).fillOpacity(0).strokeWidth(0), R.center());
    });
});

sd.main(async () => {
    await sd.pause();
    focus.startAnimate().focus(1, 1, n, m).endAnimate();
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const element = a.element(i, j);
            element.child("cover").startAnimate().fillOpacity(0.5).endAnimate();
        }
    }
    await sd.pause();
    focus
        .startAnimate()
        .focus(1, 1, n - 1, m)
        .endAnimate();
    await sd.pause();
    for (let i = 1; i < n; i++) {
        for (let j = 1; j <= m; j++) {
            const element = a.element(i, j);
            element.child("cover").startAnimate().fillOpacity(0).endAnimate();
        }
    }
    await sd.pause();
    focus
        .startAnimate()
        .focus(1, 1, n, m - 1)
        .endAnimate();
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j < m; j++) {
            const element = a.element(i, j);
            if (i === n) element.child("cover").startAnimate().fillOpacity(0).endAnimate();
            else element.child("cover").startAnimate().color(C.textBlue).fillOpacity(0.5).endAnimate();
        }
    }
    await sd.pause();
    focus
        .startAnimate()
        .focus(1, 1, n - 1, m - 1)
        .endAnimate();
    await sd.pause();
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < m; j++) {
            const element = a.element(i, j);
            element.child("cover").startAnimate().fillOpacity(0).endAnimate();
        }
    }
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
});

import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 5;
const arr = new sd.Array(svg).resize(n * 2).start(1);
const focus = sd.Focus(arr);

sd.init(() => {
    sd.Brace(arr, "t")
        .brace(1, 2 * n)
        .value("2n");
    for (let i = 1; i <= n; i++) arr.value(i, `S${i}`);
    for (let i = n + 1; i <= 2 * n; i++) arr.value(i, `S${i - n}`);
});

sd.main(async () => {
    await sd.pause();
    const root = new sd.Rect(svg)
        .width(n * 40 - 10)
        .height(10)
        .cx((arr.element(1).cx() + arr.element(n).cx()) / 2)
        .y(arr.my() + 10)
        .childAs(new sd.Rect(svg).height(100).childAs(new sd.Text(svg, "?"), R.center()), function (parent, child) {
            child.x(parent.x()).y(parent.my()).width(parent.width());
        })
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    focus.startAnimate().focus(1, n).endAnimate();
    for (let i = 1; i < n; i++) {
        await sd.pause();
        focus
            .startAnimate()
            .focus(i + 1, i + n)
            .endAnimate();
        root.startAnimate().dx(40).endAnimate();
    }
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const a = [3, 5];
const n = a.length;
const grid = new sd.Grid(svg).axis("col").align("my").startN(1).startM(1);

sd.init(() => {
    a.forEach(count => {
        grid.pushPrimary(count);
    });
    for (let i = 1; i <= n; i++) sd.MathLabel(grid.element(i, a[i - 1]), `a_{${i}}`, "bc");
    for (let i = 1; i <= grid.endM(); i++) {
        new sd.Text(grid, String.fromCharCode([64 + i])).x(grid.mx() + 5).cy(grid.my() - 20 - (i - 1) * grid.elementHeight());
    }
});

sd.main(async () => {
    await sd.pause();
    const correct = [];
    const correctBox = [];
    for (let i = 1, x; i <= n; i++) {
        x = sd.rand(1, a[i - 1]);
        correct.push(x);
        correctBox.push(
            new sd.Rect(svg)
                .color(C.red)
                .opacity(0)
                .center(grid.element(i, a[i - 1] - x + 1).center())
                .startAnimate()
                .opacity(1)
                .endAnimate()
        );
    }
    await sd.pause();
    for (let i = 1; i < n; i++) {
        const box = new sd.Rect(svg)
            .center(correctBox[i - 1].center())
            .color(C.red)
            .opacity(0.5);
        box.startAnimate().dx(40).endAnimate();
        const link = new sd.Line(svg);
        link.source(correctBox[i - 1].center());
        link.target(box.center());
        link.startAnimate().pointStoT().endAnimate().arrow();
    }
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const n = 9;
const stk = new sd.ValueStack(svg).align("x").dy(80).elementHeight(60);
const arr = new sd.Array(svg).resize(4);

sd.init(() => {
    sd.Label(arr, "模板");
    for (let i = 1; i <= n; i++) {
        stk.push(new sd.Array(svg).resize(4));
    }
    arr.forEachElement(element => {
        element.onClick(() => {
            sd.inter(async () => {
                element.startAnimate().color(C.orange).endAnimate();
            });
        });
    });

    sd.Brace(stk)
        .brace(0, n - 1, "l")
        .value("n个串");
});

sd.main(async () => {
    await sd.pause();
    stk.forEachElement(row => {
        row.startAnimate();
        for (let i = 0; i < 4; i++) {
            row.color(i, arr.color(i));
        }
        row.endAnimate();
    });

    await sd.pause();
    stk.forEachElement(row => {
        const l = new sd.Line(svg);
        l.source(V.add(row.pos("mx", "cy"), [30, 0]));
        l.target(V.add(l.source(), [70, 0]));
        l.startAnimate().pointStoT().endAnimate().arrow();
        const value = new sd.Text(svg, "Hash Value");
        l.childAs(value, R.aside("rc", 20));
        value.opacity(0).startAnimate().opacity(1).endAnimate();
    });
});

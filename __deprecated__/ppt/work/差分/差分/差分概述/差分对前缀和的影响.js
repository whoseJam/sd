import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const data = "000000000";
const n = data.length;
const d = new sd.Array(svg).pushArray(data);
const a = new sd.Array(svg).pushArray(data).y(120);

sd.init(() => {
    sd.Label(a, "a");
    sd.Label(d, "d");
    d.forEachElement((element, i) => {
        element.childAs(
            new sd.Button(div)
                .width(20)
                .text("+")
                .onClick(() => {
                    sd.inter(async () => {
                        await onAdd(i, +1);
                    });
                }),
            R.aside("tc")
        );
        element.childAs(
            new sd.Button(div)
                .width(20)
                .text("-")
                .onClick(() => {
                    sd.inter(async () => {
                        await onAdd(i, -1);
                    });
                }),
            R.aside("bc")
        );
    });
});

sd.main(async () => {});

async function onAdd(x, d_) {
    d.startAnimate()
        .text(x, d.intValue(x) + d_)
        .endAnimate();
    a.startAnimate();
    for (let i = x; i < n; i++) a.text(i, a.intValue(i) + d_);
    a.endAnimate();
}

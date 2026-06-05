import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const data = "00000000000000000";
const n = data.length;
const dd = new sd.Array(svg).pushArray(data);
const d = new sd.Array(svg).pushArray(data).y(100);
const a = new sd.Array(svg).pushArray(data).y(160);

sd.init(() => {
    sd.Label(a, "a");
    sd.Label(d, "d");
    sd.Label(dd, "dd");
    dd.forEachElement((element, i) => {
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
    dd.startAnimate()
        .text(x, dd.intValue(x) + d_)
        .endAnimate();
    {
        let sum = 0;
        d.startAnimate();
        for (let i = 0; i < n; i++) {
            sum += dd.intValue(i);
            d.text(i, sum);
        }
        d.endAnimate();
    }
    {
        let sum = 0;
        a.startAnimate();
        for (let i = 0; i < n; i++) {
            sum += d.intValue(i);
            a.text(i, sum);
        }
        a.endAnimate();
    }
}

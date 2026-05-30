import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const n = 5;
const d = new sd.Grid(svg).elementWidth(75).elementHeight(75);
const a = new sd.Grid(svg).elementWidth(75).elementHeight(75).dx(450);

sd.init(() => {
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
            d.insert(i, j, 0);
            a.insert(i, j, 0);
        }
    sd.Label(a, "a", "tc");
    sd.Label(d, "d", "tc");
    d.forEachElement((element, i, j) => {
        element.childAs(
            new sd.Button(svg)
                .text("+")
                .width(20)
                .height(30)
                .onClick(() => {
                    sd.inter(async () => {
                        await onAdd(i, j, +1);
                    });
                }),
            (parent, child) => {
                child.x(parent.x()).y(parent.y());
            }
        );
        element.childAs(
            new sd.Button(svg)
                .text("-")
                .width(20)
                .height(30)
                .onClick(() => {
                    sd.inter(async () => {
                        await onAdd(i, j, -1);
                    });
                }),
            (parent, child) => {
                child.mx(parent.mx()).y(parent.y());
            }
        );
    });
});

sd.main(async () => {});

async function onAdd(x, y, d_) {
    d.startAnimate()
        .text(x, y, d.intValue(x, y) + d_)
        .endAnimate();
    a.startAnimate();
    for (let i = x; i < n; i++) for (let j = y; j < n; j++) a.text(i, j, a.intValue(i, j) + d_);
    a.endAnimate();
}

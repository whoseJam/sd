import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const source = "0100110111110001";
const arr1 = new sd.Array(svg).pushArray(source).start(1);

sd.init(() => {
    for (let i = 1; i < arr1.length(); i++) {
        const e1 = arr1.element(i);
        const e2 = arr1.element(i + 1);
        const button = new sd.Button(div)
            .width(30)
            .cx((e1.x() + e2.mx()) / 2)
            .my(arr1.y() - 10)
            .text("↔");
        button.onClick(() => {
            if (e1.intValue() === e2.intValue()) {
                sd.inter(async () => {
                    e1.startAnimate()
                        .color(C.blue)
                        .value(e1.intValue() ^ 1)
                        .endAnimate()
                        .startAnimate()
                        .color(C.white)
                        .endAnimate();
                    e2.startAnimate()
                        .color(C.blue)
                        .value(e2.intValue() ^ 1)
                        .endAnimate()
                        .startAnimate()
                        .color(C.white)
                        .endAnimate();
                });
            }
        });
    }
});

sd.main(async () => {});

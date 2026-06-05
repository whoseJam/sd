import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const source = "111111000000";
const arr1 = new sd.Array(svg).pushArray(source).start(1);
const arr2 = new sd.Array(svg).start(1);

sd.init(() => {
    arr2.y(arr1.my() + 40);
    for (let i = 0; i < source.length; i++) {
        const v = +source[i] ^ (i & 1);
        arr2.push(v);
    }
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
                    const e3 = arr2.element(i);
                    const e4 = arr2.element(i + 1);
                    const v3 = e3.drop();
                    const v4 = e4.drop();
                    e3.startAnimate().valueFromExist(v4).endAnimate();
                    e4.startAnimate().valueFromExist(v3).endAnimate();
                });
            }
        });
    }
});

sd.main(async () => {});

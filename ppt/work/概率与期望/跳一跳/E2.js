import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const boxes = new sd.ValueArray(svg).elementWidth(60).start(1);
const data = [1, 2, 1, 1, 3, 2, 1, 3];
const n = data.length + 1;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        boxes.push(new sd.Box(svg));
    }
    let cnt = 2;
    for (let i = 2; i <= n; i++) {
        const color = data[i - 2] === 1 ? C.textBlue : C.red;
        sd.Link(boxes.element(i - 1), boxes.element(i), sd.Curve, "cx", "y", "cx", "y")
            .bending(-0.5)
            .stroke(color)
            .arrow();
        if (data[i - 2] === 1) {
            sd.Aside(boxes.element(i), new sd.Math(svg, "+1").fontSize(10).color(C.grey), "bc", 10);
            cnt = 2;
        }
        if (data[i - 2] === 2) {
            sd.Aside(boxes.element(i), new sd.Math(svg, `+cnt(${cnt})`).fontSize(10).color(C.grey), "bc", 30);
            cnt *= 2;
        }
        if (data[i - 2] === 3) {
            sd.Aside(boxes.element(i), new sd.Math(svg, `+cnt(${cnt})`).fontSize(10).color(C.grey), "bc", 30);
            sd.Aside(boxes.element(i), new sd.Math(svg, "+y_i").fontSize(10), "bc", 50);
            cnt *= 2;
        }
    }
});

sd.main(async () => {});

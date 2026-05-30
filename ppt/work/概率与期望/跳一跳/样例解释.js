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
});

sd.main(async () => {
    let cnt = 2;
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        const color = data[i - 2] === 1 ? C.textBlue : C.red;
        sd.Link(boxes.element(i - 1), boxes.element(i), sd.Curve, "cx", "y", "cx", "y")
            .bending(-0.5)
            .stroke(color)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
        if (data[i - 2] === 1) {
            appear(sd.Aside(boxes.element(i), new sd.Math(svg, "+1"), "bc", 10));
            cnt = 2;
        }
        if (data[i - 2] === 2) {
            appear(sd.Aside(boxes.element(i), new sd.Math(svg, `+cnt(${cnt})`), "bc", 30));
            cnt *= 2;
        }
        if (data[i - 2] === 3) {
            appear(sd.Aside(boxes.element(i), new sd.Math(svg, `+cnt(${cnt})`), "bc", 30));
            appear(sd.Aside(boxes.element(i), new sd.Math(svg, "+y_i"), "bc", 50));
            cnt *= 2;
        }
    }
});

function appear(element) {
    element.fontSize(10).opacity(0).after(300).startAnimate().opacity(1).endAnimate();
}

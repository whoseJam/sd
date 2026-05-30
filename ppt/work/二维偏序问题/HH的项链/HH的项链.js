import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [0, 1, 2, 3, 2, 3, 1, 2, 1, 3];
const arr = new sd.Array(svg);

sd.init(() => {
    arr.push();
    for (let i = 1; i < data.length; i++) {
        arr.push(data[i]);
    }
    arr.cx(600).cy(300);
});

sd.main(async () => {
    for (let i = 1; i < data.length; i++) {
        await sd.pause();
        let j = i - 1;
        for (; j >= 1; j--) {
            if (data[j] === data[i]) break;
        }
        sd.Link(arr.element(i), arr.element(j), sd.Curve, "cx", "y", "cx", "y")
            .bending(1)
            .startAnimate()
            .pointStoT()
            .value(new sd.Text(svg, "prev").fontSize(10 + 0), R.pointAtPathByRate(0.5, "cx", "my"))
            .endAnimate()
            .arrow();
    }
    await sd.pause();
    arr.startAnimate().color(3, 7, C.green).endAnimate();
});

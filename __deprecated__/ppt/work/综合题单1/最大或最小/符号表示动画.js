import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const arr = new sd.Array(svg);
const data = [1, 3, 2, 6, 4, 3, 2, 1, 3];
const x = 3;

sd.init(() => {
    arr.resize(data.length);
    data.forEach((item, i) => {
        arr.element(i).value(new sd.Math(svg, item), R.center());
    });
});

sd.main(async () => {
    await sd.pause();
    const text = new sd.Math(svg, `x=${x}`)
        .opacity(0)
        .cx(arr.cx())
        .my(arr.y() - 20)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    await sd.pause();
    arr.forEachElement((element, i) => {
        const label = data[i] > x ? "+" : data[i] < x ? "-" : "o";
        element.value().startAnimate().transformMath(label).endAnimate();
    });
});

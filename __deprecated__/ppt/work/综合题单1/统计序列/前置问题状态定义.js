import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 10;
const j = 4;
const i = 7;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    arr.element(i).value(math("a_i"), R.center());
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "j").startAnimate().moveTo(j).endAnimate();
    sd.Pointer(arr, "j-1")
        .startAnimate()
        .moveTo(j - 1)
        .endAnimate();
    arr.startAnimate();
    arr.element(j).value(math("a_j"), R.center());
    arr.endAnimate();
});

function math(str) {
    return new sd.Math(svg, str);
}

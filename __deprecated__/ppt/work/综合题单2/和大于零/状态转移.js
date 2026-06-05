import * as sd from "@/sd";

const svg = sd.svg();
const array = new sd.Array(svg);
const i = 8;
const j = 4;
const pointerI = new sd.Pointer(array, "i", "b", 10, 30);
const pointerJ = new sd.Pointer(array, "j", "b", 10, 30);

sd.init(() => {
    array.resize(10).start(1);
});

sd.main(async () => {
    await sd.pause();
    pointerI.startAnimate().moveTo(i).endAnimate();
    await sd.pause();
    pointerJ.startAnimate().moveTo(j).endAnimate();
    await sd.pause();
    sd.Brace(array)
        .brace(j + 1, i, "b")
        .opacity(0)
        .value(new sd.Math(svg, "s_i-s_j"))
        .startAnimate()
        .opacity(1)
        .endAnimate();
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [3, 2, 9, 5, 9, 7, 5, 9, 4, 3, 8];
const at = 5;
const lk = 3;
const rk = 8;
const arr = new sd.Array(svg).start(1).pushArray(data);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "$k$").startAnimate().moveTo(at).endAnimate();
    arr.startAnimate().color(at, C.blue).endAnimate();
    await sd.pause();
    sd.Pointer(arr, "$L_k$").startAnimate().moveTo(lk).endAnimate();
    sd.Pointer(arr, "$R_k$").startAnimate().moveTo(rk).endAnimate();
    arr.startAnimate().color(lk, C.blue).color(rk, C.blue).endAnimate();
    await sd.pause();
    sd.Brace(arr, "b")
        .startAnimate()
        .brace(lk + 1, at)
        .value("$k-L_k$")
        .endAnimate();
    sd.Brace(arr, "b")
        .braceGap(50)
        .startAnimate()
        .brace(at, rk - 1)
        .value("$R_k-k$")
        .endAnimate();
});

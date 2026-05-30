import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg);
const data = "????(????)????";
const pI = sd.Pointer(arr, "i", "b", 5, 30, 5);
const pJ = sd.Pointer(arr, "j", "b", 5, 30, 5);

sd.init(() => {
    arr.pushArray(data);
    pI.moveTo(4);
})

sd.main(async () => {
    await sd.pause();
    pJ.startAnimate().moveTo(9).endAnimate();
})
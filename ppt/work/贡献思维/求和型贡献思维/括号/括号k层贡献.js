import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg);
const data = "????(????)????";
const pI = sd.Pointer(arr, "i", "b", 5, 30, 5);
const pJ = sd.Pointer(arr, "j", "b", 5, 30, 5);
const k = 3;

const left = [];
const right = [6];

sd.init(() => {
    arr.pushArray(data);
    pI.moveTo(4);
    pJ.moveTo(9);
    for (let i = 1; i <= k; i++)
        left.push(sd.rand(0, 4));
    for (let i = 1; i < k; i++) {
        right.push(sd.rand(4, data.length - 1));
    }
    left.sort((a, b) => b - a);
    right.sort((a, b) => a - b);
})

sd.main(async () => {
    for (let i = 0; i < k; i++) {
        await sd.pause();
        sd.Brace(arr).startAnimate().brace(left[i], right[i], "b", i * 10 + 10).endAnimate();
    }
})
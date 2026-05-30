import * as sd from "@/sd";

const svg = sd.svg();
const p = 10;
const v = 3;
const data = [0, 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, 0, 0];
const arr1 = new sd.Array(svg).x(100);
const arr2 = new sd.Array(svg).x(100).y(80);
const arr3 = new sd.Array(svg).x(100).y(160);

sd.init(() => {
    arr1.pushArray(data);
    sd.Pointer(arr1, "pos").moveTo(p);
});

sd.main(async () => {
    await sd.pause();
    const d1 = del(data);
    sd.Label(arr2, "一次差分").opacity(0).startAnimate().opacity(1).endAnimate();
    d1.forEach(d => arr2.startAnimate().push(d).endAnimate());
    await sd.pause();
    const d2 = del(d1);
    sd.Label(arr3, "二次差分").opacity(0).startAnimate().opacity(1).endAnimate();
    d2.forEach(d => arr3.startAnimate().push(d).endAnimate());
});

function del(arr) {
    const arr_ = [arr[0]];
    for (let i = 1; i < arr.length; i++) arr_.push(arr[i] - arr[i - 1]);
    return arr_;
}

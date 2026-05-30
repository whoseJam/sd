import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const [l, r, d] = [2, 6, +2];
const arr1 = new sd.Array(svg).x(100);
const arr2 = new sd.Array(svg).x(100).y(80).opacity(0);
const arr3 = new sd.Array(svg).x(100).y(160).opacity(0);

sd.init(() => {
    for (let i = 0; i < n; i++) {
        arr1.push(sd.rand(1, 5));
        arr2.push(l <= i && i <= r ? d : 0);
    }
    sd.Label(arr1, "原始序列");
    sd.Label(arr2, "增量序列");
    sd.Pointer(arr1, "l", "b").moveTo(l);
    sd.Pointer(arr1, "r", "b").moveTo(r);
});

sd.main(async () => {
    await sd.pause();
    arr2.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    arr3.startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < n; i++) {
        arr3.startAnimate()
            .push(arr1.intValue(i) + arr2.intValue(i))
            .endAnimate();
    }
});

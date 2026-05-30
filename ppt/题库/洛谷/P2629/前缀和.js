import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg);
const sum = new sd.Array(svg).dx(-40).y(60);
const data = [-3, 5, 1, 2];

sd.init(() => {
    sd.Label(arr, "原始数组", "lc");
    arr.pushArray(data);
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate();
    arr.pushArray(data);
    arr.endAnimate();
    await sd.pause();
    sd.Label(sum, "前缀和", "lc").opacity(0).startAnimate().opacity(1).endAnimate();
    sum.startAnimate();
    sum.push(0);
    for (let i = 0, s = 0; i < arr.length(); i++) {
        s = arr.intValue(i) + s;
        sum.push(s);
    }
    sum.endAnimate();
    
    const brace = sd.Brace(sum);
    for (let i = 1; i <= data.length; i++) {
        await sd.pause();
        brace.startAnimate().brace(i, i + data.length - 1, "b", 5).endAnimate();
        await sd.pause();
        sum.startAnimate().color(i - 1, C.blue).color(i, i + data.length - 1, C.coral).endAnimate();
        await sd.pause();
        sum.startAnimate().color(C.white).endAnimate();
    }
})
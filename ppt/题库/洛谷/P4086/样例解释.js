import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const data = [1, 1, 2, 1, 2, 1, 2, 2, 3, 3];
const arr = new sd.Array(svg).resize(n).start(1);
const sum = new sd.Array(svg)
    .dy(60)
    .resize(n)
    .start(1)
    .forEachElement(element => element.opacity(0));
const mn = new sd.Array(svg)
    .dy(120)
    .resize(n)
    .start(1)
    .forEachElement(element => element.opacity(0));

sd.init(() => {});

sd.main(async () => {
    const brace = sd.Brace(arr).value("去掉min取平均");
    for (let i = 1; i <= n - 2; i++) {
        await sd.pause();
        brace
            .startAnimate()
            .brace(i + 1, n)
            .endAnimate();
        arr.startAnimate().color(1, i, C.grey).endAnimate();
    }
    await sd.pause();
    arr.startAnimate();
    for (let i = 0; i < n; i++) arr.value(i + 1, data[i]);
    arr.endAnimate();
    await sd.pause();
    sd.Label(mn, "后缀min").opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Label(sum, "后缀sum").opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = n; i >= 1; i--) {
        await sd.pause();
        const mnv = i === n ? data[i - 1] : Math.min(data[i - 1], mn.intValue(i + 1));
        const sumv = i === n ? data[i - 1] : data[i - 1] + sum.intValue(i + 1);
        mn.startAnimate().opacity(i, 1).value(i, mnv).endAnimate();
        sum.startAnimate().opacity(i, 1).value(i, sumv).endAnimate();
        if (i <= n - 2) {
            brace.startAnimate().brace(i, n).endAnimate();
            arr.startAnimate().color(i, C.white).endAnimate();
        }
    }
});

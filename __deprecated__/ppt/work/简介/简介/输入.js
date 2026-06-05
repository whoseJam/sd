import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.BarArray(svg);

sd.init(args => {
    if (args.arr) arr.pushArray(args.arr);
    else arr.push(1).push(3).push(2).push(4);
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().sort().endAnimate();
});

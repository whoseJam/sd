import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const sum = new sd.Math(svg, "\\sum_{i=1}^ni").fontSize(40);
const text = new sd.Text(svg, "for(int i=1;i<=n;i++)ans+=i;").fontSize(40).dx(300).cy(sum.cy());

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sum.startAnimate().subtextColor("i=1", C.orange).endAnimate();
    text.startAnimate().subtextColor("i=1", C.orange).endAnimate();
    await sd.pause();
    sum.startAnimate().subtextColor("n", C.textBlue).endAnimate();
    text.startAnimate().subtextColor("i<=n", C.textBlue).endAnimate();
    await sd.pause();
    sum.startAnimate().subtextColorLast("i", C.red).endAnimate();
    text.startAnimate().subtextColor("ans+=i", C.red).endAnimate();
});

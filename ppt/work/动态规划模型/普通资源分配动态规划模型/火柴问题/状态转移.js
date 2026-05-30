import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const num = new sd.Box(svg).value("$i$", R.center()).width(200);

sd.init(() => {
    sd.Label(num, "拼出来的数字");
});

sd.main(async () => {
    await sd.pause();
    new sd.Math(svg, "k")
        .fontSize(num.value().fontSize())
        .opacity(0)
        .cy(num.cy())
        .mx(num.mx())
        .startAnimate()
        .opacity(1)
        .endAnimate();
    num.startAnimate().width(180).text("$i-u_k$").endAnimate();
});

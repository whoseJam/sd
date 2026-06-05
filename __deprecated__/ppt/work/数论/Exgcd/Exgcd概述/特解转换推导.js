import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "ax+by=gcd(a,b)");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate()
        .text("ax_0+by_0=gcd(a,b)", [
            ["x", "x_0"],
            ["y", "y_0"],
        ])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate()
        .text("\\frac{c}{gcd(a,b)}(ax_0+by_0)=\\frac{c}{gcd(a,b)}gcd(a,b)", [
            ["ax_0+by_0", "ax_0+by_0"],
            ["gcd(a,b)", "gcd(a,b)"],
        ])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate().text("\\frac{c}{gcd(a,b)}(ax_0+by_0)=c").center(center).endAnimate();
    await sd.pause();
    math.startAnimate().text("a(\\frac{c}{gcd(a,b)}x_0)+b(\\frac{c}{gcd(a,b)}y_0)=c").center(center).endAnimate();
});

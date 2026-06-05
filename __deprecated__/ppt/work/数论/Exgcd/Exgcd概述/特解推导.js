import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "bx+(a\\%b)y=gcd(a,b)");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate()
        .text("bx_1+(a\\%b)y_1=gcd(a,b)", [
            ["x", "x_1"],
            ["y", "y_1"],
        ])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate()
        .text("bx_1+(a-b\\lfloor\\frac{a}{b}\\rfloor)y_1=gcd(a,b)", [["(a\\%b)", "(a-b\\lfloor\\frac{a}{b}\\rfloor)"]])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate().text("ay_1+b(x_1-\\lfloor \\frac a b\\rfloor y_1)=gcd(a,b)").center(center).endAnimate();
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.Coord(svg).viewX(-5).viewY(-3).viewWidth(10).viewHeight(6).width(250).height(150);
const funcs = [x => 1, x => 1 + x, x => 1 + x + (1.0 / 2) * x ** 2, x => 1 + x + (1.0 / 2) * x ** 2 + (1.0 / 6) * x ** 3];

sd.init(() => {
    coord.draw(1, x => Math.exp(x));
});

sd.main(async () => {
    await sd.pause();
    const poly = coord.startAnimate().draw(2, funcs[0]).stroke(C.red).endAnimate();
    console.log(poly);
    for (let i = 1; i < funcs.length; i++) {
        await sd.pause();
        poly.startAnimate().function(funcs[i]).endAnimate();
    }
});

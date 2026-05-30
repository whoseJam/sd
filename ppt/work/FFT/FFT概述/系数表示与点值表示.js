import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const L = 10;
const coord = new sd.Coord(svg).viewBox(-L / 2, -L / 2, L, L);
const arr = new sd.Array(svg);
const dot = new sd.Array(svg);
sd.Index(arr, "t");
sd.Index(dot, "t");
const colorList = [C.orange, C.red, C.green, C.blue];
const sampleX = [-2, -1, 0, 1];

sd.init(() => {
    coord.width(300).height(250);
    arr.x(coord.mx() + 20).y(coord.cy() - 20);
    dot.x(coord.mx() + 20).y(coord.cy() + 60);
});

sd.main(async () => {
    await sd.pause();
    coord.startAnimate();
    const A = coord.draw(1, x => x ** 3 + x ** 2 - 2 * x - 3);
    coord.endAnimate();
    A.childAs("label", new sd.Math(A, "A(x)=x^3+x^2-2x-3"), R.pointAtPathByRate(1, "x", "cy", 10, 0));

    await sd.pause();
    arr.startAnimate().push(-3).endAnimate();
    arr.startAnimate().push(-2).endAnimate();
    arr.startAnimate().push(1).endAnimate();
    arr.startAnimate().push(1).endAnimate();

    await sd.pause();
    const circles = [];
    for (let i = 0; i < sampleX.length; i++) {
        const point = [coord.globalX(sampleX[i]), A.globalY(sampleX[i])];
        circles.push(
            new sd.Circle(svg).r(5).color(colorList[i]).center(point).opacity(0).startAnimate().opacity(1).endAnimate()
        );
    }
    await sd.pause();
    for (let i = 0; i < sampleX.length; i++) {
        const circ = new sd.Circle(svg).r(5).color(colorList[i]).center(circles[i].center());
        dot.startAnimate();
        dot.push();
        dot.element(dot.end()).valueFromExist(circ, R.center());
        dot.endAnimate();
    }
});

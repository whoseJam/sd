import * as sd from "@/sd";

const svg = sd.svg();
const L = 10;
const coord = new sd.Coord(svg).viewBox(-L / 2, -L / 2, L, L);

sd.init(() => {
    coord.width(300).height(250);
});

sd.main(async () => {
    const focus = sd.Focus(svg);
    const mtA = new sd.Math(svg, "A(x)=x^2+3x+2").x(coord.mx() + 20).y(coord.y());
    const mtB = new sd.Math(svg, "B(x)=-\\frac{1}{2}x^2+1").x(coord.mx() + 20).cy(coord.cy());
    const mtC = new sd.Math(svg, "C(x)=-x-3").x(coord.mx() + 20).my(coord.my());

    await sd.pause();
    focus.startAnimate().focus(mtA).endAnimate();
    coord.startAnimate();
    const A = coord.draw(1, x => x ** 2 + 3 * x + 2);
    coord.endAnimate();
    await sd.pause();
    focus.startAnimate().focus(mtB).endAnimate();
    coord.startAnimate();
    const B = coord.draw(2, x => -0.5 * x ** 2 + 1);
    coord.endAnimate();
    await sd.pause();
    focus.startAnimate().focus(mtC).endAnimate();
    coord.startAnimate();
    const C = coord.draw(3, x => -x - 3);
    coord.endAnimate();
});

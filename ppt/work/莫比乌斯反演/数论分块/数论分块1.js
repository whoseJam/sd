import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 15;
const rct = new sd.Rect(svg).color(C.BLUE).opacity(0);
const arrF = new sd.ValueArray(svg).elementWidth(60).start(1);
const arrC = new sd.ValueArray(svg).elementWidth(60).start(1).y(60);
const arrR = new sd.ValueArray(svg).elementWidth(60).start(1).y(120);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arrF.push(new sd.Math(arrF, `f(${i})`));
        arrC.push(new sd.Math(arrC, `\\lfloor\\frac{${n}}{${i}}\\rfloor`));
        arrR.push(new sd.Math(arrR, `${Math.floor(n / i)}`));
    }
    arrR.opacity(0);
});

sd.main(async () => {
    await sd.pause();
    arrR.startAnimate().opacity(1).endAnimate();
    for (let l = 1, r; l <= n; l = r + 1) {
        r = Math.floor(n / Math.floor(n / l));
        await sd.pause();
        focus(l, r);
    }
});

function focus(l, r) {
    const x = arrF.x() + arrF.elementWidth() * (l - 1);
    const mx = arrF.x() + arrF.elementWidth() * r;
    const y = arrF.y();
    const my = arrR.my();
    if (rct.opacity() === 0) {
        rct.x(x)
            .y(y)
            .width(mx - x)
            .height(my - y);
        rct.startAnimate().opacity(1).endAnimate();
    } else {
        rct.startAnimate();
        rct.x(x)
            .y(y)
            .width(mx - x)
            .height(my - y);
        rct.endAnimate();
    }
}

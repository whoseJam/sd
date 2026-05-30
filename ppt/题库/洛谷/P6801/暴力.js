import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const data = [1, 3, 2, 1, 2];

sd.init(() => {
    grid.axis("col").align("my");
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]; j++) {
            grid.insert(i, j);
        }
    }
})

sd.main(async () => {
    const top = new sd.Line(svg).source(-20, 0).target(220, 0).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const left = new sd.Line(svg).source(0, -20).target(0, 140).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const right = new sd.Line(svg).source(200, -20).target(200, 140).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const bottom = new sd.Line(svg).source(-20, 120).target(220, 120).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    await sd.pause();
    top.startAnimate().opacity(0).endAnimate();
    left.startAnimate().opacity(0).endAnimate();
    right.startAnimate().opacity(0).endAnimate();
    bottom.startAnimate().opacity(0).endAnimate();
    await sd.pause();
    for (let t = 1; t <= 3; t++) {
        await sd.pause();
        if (t === 1) top.y(120 - 40 * t).startAnimate().opacity(1).endAnimate();
        else top.startAnimate().y(120 - 40 * t).endAnimate();
        new sd.Line(svg).source(-20, 120 - (t - 1) * 40).target(220, 120 - (t - 1) * 40).stroke(C.deepSkyBlue).strokeWidth(2).strokeDashArray([5, 5]).opacity(0).startAnimate().opacity(1).endAnimate();
        for (let l = 0; l < data.length; l++) {
            if (data[l] < t) continue;
            await sd.pause();
            if (!left.opacity()) left.x(l * 40).startAnimate().opacity(1).endAnimate();
            else left.startAnimate().x(l * 40).endAnimate();
            for (let r = l; r < data.length; r++) {
                if (data[r] < t) break;
                await sd.pause();
                if (!right.opacity()) right.x(r * 40 + 40).startAnimate().opacity(1).endAnimate();
                else right.startAnimate().x(r * 40 + 40).endAnimate();
            }
            await sd.pause();
            right.startAnimate().opacity(0).endAnimate();
        }
        await sd.pause();
        left.startAnimate().opacity(0).endAnimate();
    }
    
})
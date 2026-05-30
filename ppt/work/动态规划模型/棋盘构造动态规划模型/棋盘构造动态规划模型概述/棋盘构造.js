import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const m = 6;
const grid = new sd.Grid(svg).startN(1).startM(1);

sd.init(() => {
    grid.n(n).m(m);
});

sd.main(async () => {
    await sd.pause();
    sd.Brace(grid).startAnimate().brace(grid.element(1, 1), grid.element(1, m), "t").value("宽度不太大").endAnimate();
    await sd.pause();
    const ocean = new sd.Rect(svg).color(C.blue).x(-80);
    const grass = new sd.Rect(svg).color(C.green).x(-80).y(80);
    sd.Label(ocean, "0", "lc");
    sd.Label(grass, "1", "lc");
    ocean.opacity(0).startAnimate().opacity(1).endAnimate();
    grass.opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        let ans = "";
        for (let j = 1; j <= m; j++) {
            const x = sd.rand(0, 100) <= 50 ? 0 : 1;
            ans = ans + String(x);
        }
        const math = new sd.Math(svg, ans)
            .cx(grid.cx())
            .y(grid.my() + 20)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        await sd.pause();
        math.startAnimate()
            .x(grid.mx() + 40)
            .cy(grid.element(i, 1).cy())
            .endAnimate();
        grid.startAnimate();
        for (let j = 0; j < m; j++) {
            if (ans[j] === "0") grid.color(i, j + 1, C.blue);
            else grid.color(i, j + 1, C.green);
        }
        grid.endAnimate();
    }
    await sd.pause();
    const arrow = new sd.Line(svg).source(grid.element(1, m).pos("mx", "cy", 20)).target(grid.element(n, m).pos("mx", "cy", 20)).startAnimate().pointStoT().endAnimate().arrow();
});

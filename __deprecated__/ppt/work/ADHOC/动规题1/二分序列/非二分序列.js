import * as sd from "@/sd";

const svg = sd.svg();
const bar = new sd.BarArray(svg).pushArray("321");
const g = new sd.TinyGraph(svg).scale(0.6);

sd.init(() => {
    g.link(1, 2);
    g.link(1, 3);
    g.link(2, 3);
    g.cy(bar.cy()).x(bar.mx() + 60);
});

sd.main(async () => {});

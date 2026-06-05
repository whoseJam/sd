import * as sd from "@/sd";

const svg = sd.svg();
const segment = new sd.BoxTree(svg).width(800);

sd.init(() => {
    build(1, 1, 8);
});

sd.main(async () => {});

function build(x, l, r) {
    segment.newNode(x, `[${l},${r}]`);
    if (x > 1) segment.newLink(x >> 1, x);
    sd.Aside(segment.element(x), new sd.Box(svg, new sd.Math(svg, `L_{${x}}`)).height(15).width(30), l === r ? "bc" : "tc");
    if (l === r) return;
    const mid = (l + r) >> 1;
    build(x << 1, l, mid);
    build((x << 1) | 1, mid + 1, r);
}

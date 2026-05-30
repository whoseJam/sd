import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).resize(n).start(1);
const rt = new sd.Vertex(svg, "rt").opacity(0);
const p = sd.Pointer(arr, "i", "b", 5, 20, 5);

sd.init(() => {
    arr.dy(-80); sd.Index(arr, "b");
    rt.x(arr.element(1).x()).y(arr.my() + 40);
})

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        if (!rt.opacity()) rt.startAnimate().opacity(1).endAnimate();
        else rt.startAnimate().dx(40).endAnimate();
    }
})
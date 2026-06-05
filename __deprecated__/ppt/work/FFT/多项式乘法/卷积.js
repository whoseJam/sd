import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const m = 5;
const a = new sd.Array(svg).resize(n);
const b = new sd.Array(svg).resize(m);
const c = new sd.Array(svg).resize(n + m - 1);

sd.init(() => {
    b.y(a.my() + 40);
    c.y(b.my() + 40);
    sd.Label(a, "A");
    sd.Label(b, "B");
    sd.Label(c, "C");
})

sd.main(async () => {
    for (let i = 0; i < n + m - 1; i++) {
        await sd.pause();
        c.startAnimate();
        c.color(i, C.orange);
        if (i > 0) c.color(i - 1, C.white);
        c.endAnimate();

        await sd.pause();
        const links = [];
        for (let j = 0; j <= i; j++) {
            const k = i - j;
            if (j >= a.length()) continue;
            if (k >= b.length()) continue;
            links.push(sd.Link(a.element(j), b.element(k), sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate());
        }
        await sd.pause();
        links.forEach(link => link.startAnimate().opacity(0).endAnimate().remove());
    }
})
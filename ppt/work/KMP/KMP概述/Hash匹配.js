import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const s = new sd.Array(svg).pushArray("AAAAABAA").start(1);
const t = new sd.Array(svg).pushArray("AAAB").start(1);
const brace = sd.Brace(s);

sd.init(() => {
    t.y(80).cx(s.cx());
    sd.Label(s, "s");
    sd.Label(t, "t");
});

sd.main(async () => {
    for (let i = 1; i + t.length() - 1 <= s.length(); i++) {
        await sd.pause();
        brace
            .startAnimate()
            .brace(i, i + t.length() - 1)
            .endAnimate();
        const line = new sd.Line(svg).opacity(0);
        line.source(V.add(brace.pos("cx", "y"), [0, -5]));
        line.target(V.add(brace.pos("cx", "y"), [0, -25]));
        line.after(brace).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        line.startAnimate()
            .value(new sd.Math(line, `H_${i}`).opacity(0), R.pointAtPathByRate(1, "cx", "my", 0, -10))
            .endAnimate();
        await sd.pause();
        line.startAnimate().opacity(0).endAnimate().remove();
    }
});

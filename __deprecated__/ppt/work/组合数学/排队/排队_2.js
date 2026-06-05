import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const m = 5;
const ins1 = 4;
const ins2 = 6;
const b = new sd.ValueArray(svg).start(1);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        b.push(new sd.Box(svg).color(C.blue));
    }
})

sd.main(async () => {
    await sd.pause();
    let t = new sd.Array(svg).resize(2).cx(b.cx()).y(b.my() + 50);
    t.color(0, C.green);
    t.color(1, C.green);
    t.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    const links = [];
    for (let i = 0; i <= n; i++) {
        const link = new sd.Line(svg);
        link.source(t.pos("cx", "y"));
        link.target((i === 0) ? b.element(i + 1).pos("x", "my") : b.element(i).pos("mx", "my"));
        link.startAnimate().pointStoT().endAnimate().arrow();
        links.push(link);
    }
    await sd.pause();
    links.forEach(link => link.startAnimate().fadeStoT().endAnimate().arrow(null).remove());
    await sd.pause();
    b.startAnimate();
    b.insertFromExistElement(ins2, t.dropLastElement())
    b.insertFromExistElement(ins1, t.dropLastElement());
    b.endAnimate();
    await sd.pause();
    const g = new sd.ValueArray(svg).start(1);
    for (let i = 1; i <= m; i++) {
        g.push(new sd.Box(svg).color(C.red));
    }
    g.cx(b.cx()).my(b.y() - 50).opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    for (let i = 0; i <= b.length(); i++) {
        const link = new sd.Line(svg);
        link.source(g.pos("cx", "my"));
        link.target((i === 0) ? b.element(i + 1).pos("x", "y") : b.element(i).pos("mx", "y"));
        link.startAnimate().pointStoT().endAnimate().arrow();
    }
})
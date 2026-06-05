import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const data = [1, 3, 2, 3, 2];
const a = new sd.Array(svg).pushArray(data);

sd.init(() => {
    sd.Label(a, "a");
});

sd.main(async () => {
    await sd.pause();
    const d = await del(a, 0, 80);
    sd.Label(d, "d");
    const lad = sd.Link(a, d).startAnimate().pointStoT().value("差分", R.pointAtPathByRate(0.5, "x", "cy", 3)).endAnimate().arrow();
    await sd.pause();
    lad.startAnimate().fadeStoT().value(null).endAnimate().remove();
    a.startAnimate().opacity(0).endAnimate();
    await sd.pause();
    const a_ = await sum(d, 0, 0);
    sd.Label(a_, "a");
    const lda = sd.Link(d, a_).startAnimate().pointStoT().value("前缀和", R.pointAtPathByRate(0.5, "x", "cy", 3)).endAnimate().arrow();
    await sd.pause();
    lda.startAnimate().fadeStoT().value(null).endAnimate().remove();
});

async function sum(d, x, y) {
    let sum = 0;
    const a = new sd.Array(svg).x(x).y(y);
    for (let i = 0; i < d.length(); i++) {
        sum += d.intValue(i);
        a.startAnimate().push(sum).endAnimate();
    }
    return a;
}

async function del(a, x, y) {
    const d = new sd.Array(svg).x(x).y(y);
    for (let i = 0; i < a.length(); i++) {
        const lst = i > 0 ? a.intValue(i - 1) : 0;
        d.startAnimate()
            .push(a.intValue(i) - lst)
            .endAnimate();
    }
    return d;
}

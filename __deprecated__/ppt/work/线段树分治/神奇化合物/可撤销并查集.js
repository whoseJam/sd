import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).pushArray("12345678").start(1);
const history = new sd.ValueStack(svg).start(1).align("x");

sd.init(() => {
    sd.Label(arr, "fa", "lc");
    history.y(arr.my() + 30);
});

sd.main(async () => {
    await next();
    await assign(1, 10);
    await assign(2, 20);
    await next();
    await assign(4, 40);
    await assign(5, 50);
    await assign(7, 70);
    await rollback();
    await rollback();
});

async function next() {
    await sd.pause();
    const arr = new sd.ValueArray(history).elementWidth(60).height(30);
    sd.Label(arr, `$H_${history.length()}$`, "lc").fontSize(15);
    history.startAnimate().push(arr).endAnimate();
}

async function rollback() {
    await sd.pause();
    const record = history.lastElement();
    for (let i = record.length() - 1; i >= 0; i--) {
        const [x, f] = record.element(i).pair;
        record.startAnimate();
        if (i + 1 <= record.end()) record.color(i + 1, C.white);
        record.color(i, C.blue);
        record.endAnimate();
        arr.startAnimate().value(x, f).endAnimate();
    }
    await sd.pause();
    history.startAnimate().erase(history.end()).endAnimate();
}

async function assign(x, f) {
    await sd.pause();
    const item = new sd.Box(svg, new sd.Text(svg, `f[${x}]=${arr.intValue(x)}`)).width(60).height(30);
    item.pair = [x, arr.intValue(x)];
    arr.startAnimate().value(x, f).endAnimate();
    history.lastElement().startAnimate().push(item).endAnimate();
}

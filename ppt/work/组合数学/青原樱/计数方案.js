import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EX = sd.exit();
const n = 8;
const m = 3;
const arr = new sd.Array(svg).start(1).resize(n);
const tree = new sd.Array(svg).dy(80).x(arr.cx() - (40 * m) / 2);
const hint = new sd.Math(svg, `n=${n},m=${m}`).fontSize(12);

sd.init(() => {
    hint.cx(arr.cx()).my(arr.y() - 30);
    for (let i = 1; i <= arr.length(); i++) {
        arr.element(i).childAs("index", new sd.Text(svg, i).fontSize(15), R.aside("tc", 3));
    }
});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    arr.startAnimate();
    for (let i = 1; i <= m; i++) {
        const element = arr.dropLastElement();
        element.startAnimate().eraseChild("index").endAnimate();
        tree.insertFromExistElement(0, element);
        element.color(C.orange);
    }
    tree.endAnimate();
    arr.endAnimate();
    await sd.pause();
    for (let i = 1; i <= arr.length(); i++) {
        arr.element(i)
            .startAnimate()
            .dx((tree.width() / (arr.length() - 1)) * (i - 1))
            .endAnimate();
    }
    await sd.pause();
    for (let i = 0; i <= arr.length(); i++) {
        let cx;
        if (i === 0) cx = arr.element(1).cx() - 40;
        else if (i === arr.length()) cx = arr.element(arr.length()).cx() + 40;
        else cx = (arr.element(i).cx() + arr.element(i + 1).cx()) / 2;
        new sd.Line(svg).source(tree.pos("cx", "y")).target([cx, arr.my()]).startAnimate().pointStoT().endAnimate().arrow();
    }
});

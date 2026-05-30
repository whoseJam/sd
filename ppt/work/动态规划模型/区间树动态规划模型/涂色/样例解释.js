import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colorSet = [C.red, C.blue, C.green, C.yellow];
const colors = "3110122331";
const arr = new sd.Array(svg);
const nodes = sd.make1d(colors.length);
let first;
let second;

sd.init(() => {
    arr.resize(colors.length);
    for (let i = 0; i < colors.length; i++) {
        arr.color(i, colorSet[+colors[i]]);
    }
    arr.forEachElement(element => {
        element.onClick(() => {
            if (first === undefined) first = element;
            else if (second === undefined) second = element;
            if (first && second) {
                const a = arr.indexOf(first);
                const b = arr.indexOf(second);
                const l = Math.min(a, b);
                const r = Math.max(a, b);
                sd.inter(() => {
                    const rect = new sd.Rect(svg);
                    rect.height(10);
                    rect.width((r - l + 1) * 40 - 10);
                    rect.cx((first.cx() + second.cx()) / 2);
                    rect.y(getBoundY(l, r) + 5);
                    rect.opacity(0).color(first.color()).startAnimate().opacity(1).endAnimate();
                    for (let i = l; i <= r; i++) nodes[i] = rect;
                    first = undefined;
                    second = undefined;
                });
            }
        });
    });
});

sd.main(async () => {
    await sd.pause();
});

function getBoundY(l, r) {
    let y = arr.my();
    for (let i = l; i <= r; i++) {
        if (!nodes[i]) continue;
        y = Math.max(nodes[i].my());
    }
    return y;
}

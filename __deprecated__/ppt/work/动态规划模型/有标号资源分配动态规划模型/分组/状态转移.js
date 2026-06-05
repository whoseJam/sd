import * as sd from "@/sd";
import { interactableSet } from "../_/InteractableSet";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const colors = [C.red, C.green, C.blue, C.orange, C.yellow, C.purple];
const arr = new sd.Array(svg).start(1);
const tiny = new sd.TinyGraph(svg);
const n = 6;
let current = 0;

D.onKeyDown("c", () => {
    current = (current + 1) % colors.length;
});

sd.init(() => {
    for (let i = 1; i <= n; i++) arr.push(i);
    for (let i = 1; i <= n; i++) tiny.newNode(i);
    for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) tiny.newLink(i, j);
    arr.cy(tiny.cy()).x(tiny.mx() + 60);
    interactableSet(arr, {
        onChangeStatus,
        once: true,
    });
});

sd.main(async () => {});

async function onChangeStatus(i) {
    arr.startAnimate().color(i, colors[current]).endAnimate();
    tiny.startAnimate();
    tiny.color(i, colors[current]);
    for (let j = 1; j <= n; j++) {
        if (i === j) continue;
        if (tiny.color(i).fill === tiny.color(j).fill) {
            tiny.element(Math.min(i, j), Math.max(i, j)).stroke(colors[current]);
        }
    }
    tiny.endAnimate();
}

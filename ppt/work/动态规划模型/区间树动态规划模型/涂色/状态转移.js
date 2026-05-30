import * as sd from "@/sd";
import { buildIntervalTree } from "../_/BuildIntervalTree";

const svg = sd.svg();
const C = sd.color();
const colors = [C.blue, C.blue, C.blue, C.red, C.red, C.blue, C.blue, C.blue, C.green, C.green, C.blue, C.blue, C.yellow, C.yellow, C.blue, C.blue];
const arr = new sd.Array(svg).resize(colors.length);
const intervals = [
    [0, 15],
    [3, 4],
    [8, 9],
    [12, 13],
];
const colorMap = {
    0: C.blue,
    3: C.red,
    8: C.green,
    12: C.yellow,
};

sd.init(() => {
    for (let i = 0; i < colors.length; i++) arr.color(i, colors[i]);
    buildIntervalTree(arr, intervals, {
        onCreateNode(l, r, fa, cx, y) {
            const rect = new sd.Rect(svg)
                .width((r - l + 1) * 40 - 10)
                .height(10)
                .cx(cx)
                .y(y)
                .color(colorMap[l]);
            if (fa) {
                const link = new sd.Line(svg).arrow();
                link.source(fa.pos("cx", "my"));
                link.target(rect.pos("cx", "y"));
            }
            return rect;
        },
        layerHeight: 30,
        initalLayerHeight: 10,
    });
});

sd.main(async () => {
    const brace = sd.Brace(arr).value("[l,r]");
    const tmp = sd.Brace(arr);
    for (let l = 0, r; l < arr.length(); l = r + 1) {
        r = l;
        while (r + 1 < arr.length() && colors[r + 1] === colors[l]) r++;
        if (colors[l] !== C.blue) {
            await sd.pause();
            tmp.startAnimate().brace(l, r).endAnimate();
            await sd.pause();
            brace.startAnimate().brace(0, r).endAnimate();
            tmp.startAnimate().opacity(0).endAnimate();
        } else {
            await sd.pause();
            brace.startAnimate().brace(0, r).endAnimate();
        }
    }
});

import * as sd from "@/sd";
import { mergeArrayOnTree } from "../_/MergeArrayOnTree";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 6;
const links = [
    [1, 2],
    [2, 5],
    [2, 6],
    [6, 3],
    [6, 4],
];
const tree = new sd.Tree(svg).layerHeight(90).width(600);
const lcaGrid = new sd.Grid(svg).x(tree.mx()).dy(-20).n(n).m(n).startN(1).startM(1);
const focus = sd.Focus(lcaGrid);

sd.init(() => {
    sd.Index(lcaGrid, "t");
    sd.Index(lcaGrid, "l");
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    lcaGrid.cy(tree.cy());
    for (let i = 1; i <= n; i++) {
        lcaGrid.value(i, i, i);
        tree.element(i).childAs("arr", new sd.Array(svg).elementWidth(15).elementHeight(15).resize(n).start(1).color(i, C.purple), R.aside("tc", 3));
    }
});

sd.main(async () => {
    await mergeArrayOnTree(tree, {
        onMergeArray,
    });
});

async function onMergeArray(u, v) {
    const du = tree.element(u);
    const dv = tree.element(v);
    const au = du.child("arr");
    const av = dv.child("arr");
    await sd.pause();
    const link = sd.Link(av, au, sd.Line, "cx", "y", "cx", "my").startAnimate().pointStoT().endAnimate().arrow();

    await sd.pause();
    au.startAnimate();
    for (let j = 1; j <= n; j++) if (av.color(j).fill === C.purple) au.color(j, C.darkPurple);
    au.endAnimate();
    const braces = [];
    const ranges = [];
    for (let l = 1, r; l <= n; l = r + 1) {
        r = l;
        while (r + 1 <= n && au.color(l).fill === au.color(r + 1).fill) r++;
        if (au.color(l).fill === C.white) continue;
        if ((r + 1 > n || au.color(r + 1).fill === C.white) && (l - 1 < 1 || au.color(l - 1).fill === C.white)) continue;
        if (l - 1 >= 1 && au.color(l - 1).fill !== au.color(l).fill && au.color(l - 1).fill !== C.white) {
            let mostLeft = l - 1;
            let mostRight = r;
            while (mostLeft - 1 >= 1 && au.color(mostLeft - 1).fill !== C.white) mostLeft--;
            while (mostRight + 1 <= n && au.color(mostRight + 1).fill !== C.white) mostRight++;
            ranges.push([mostLeft, l - 1, l, mostRight]);
        }
        braces.push(sd.Brace(au).startAnimate().brace(l, r).endAnimate());
    }
    for (let i = 0; i < ranges.length; i++) {
        await sd.pause();
        const range = ranges[i];
        focus.startAnimate().focus(range[0], range[2], range[1], range[3]).endAnimate();
        await sd.pause();
        lcaGrid.startAnimate();
        for (let x = range[0]; x <= range[1]; x++) for (let y = range[2]; y <= range[3]; y++) lcaGrid.value(x, y, u);
        lcaGrid.endAnimate();
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
    }
    await sd.pause();
    au.startAnimate();
    for (let j = 1; j <= n; j++) if (au.color(j).fill === C.darkPurple) au.color(j, C.purple);
    au.endAnimate();

    await sd.pause();
    braces.forEach(brace => brace.startAnimate().opacity(0).endAnimate().remove());
    link.startAnimate().fadeStoT().endAnimate().arrow(null).remove();
}

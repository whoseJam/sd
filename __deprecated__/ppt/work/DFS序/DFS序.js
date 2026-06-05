import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let h = sd.make1d(100);
let l = sd.make1d(100);
let cnt = 0;
let tr = new sd.Tree(svg).x(100).y(50).layerHeight(60).width(600);
let arr = new sd.Array(svg).x(100).y(350);

tr.root(1);
link(1, 2);
link(1, 3);
link(1, 4);
link(2, 5);
link(2, 6);
link(2, 7);
link(3, 8);
link(4, 9);
link(4, 10);
link(9, 11);
link(9, 12);

main();

async function main() {
    await dfs(1);
}

async function dfs(now, prt) {
    await sd.pause();
    tr.startAnimate();
    if (prt) tr.color(prt, C.DEFAULT);
    tr.color(now, C.GREEN);
    tr.endAnimate();
    await sd.pause();
    arr.startAnimate();
    arr.push(new sd.Text(svg, `${now}`));
    arr.element(arr.end()).rate(1.5)
    arr.endAnimate();

    for (let i = h[now]; i; i = l[i].nxt) {
        let v = l[i].to;
        if (v !== prt) {
            await dfs(v, now);
        }
    }

    await sd.pause();
    tr.startAnimate();
    if (prt) tr.color(prt, C.GREEN);
    tr.color(now, C.DEFAULT);
    tr.endAnimate();
}

function link(x, y) {
    tr.link(x, y);
    l[++cnt] = { nxt: h[x], to: y }; h[x] = cnt;
    l[++cnt] = { nxt: h[y], to: x }; h[y] = cnt;
}
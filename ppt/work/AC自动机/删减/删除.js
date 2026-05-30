import * as sd from "@/sd";

import { buildTrieGraphSync } from "../_/BuildTrieGraphSync";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = new sd.Focus(ac);
const arr = new sd.Array(svg).start(1).pushArray("abbaaabbabbaba");
const ans = new sd.Array(svg).start(1);
const path = new sd.Array(svg).start(1);
const data = ["abab", "babb"];
const links1 = [
    // format
    { type: sd.Line },
    { u: 2, v: 2, type: sd.CircleCurve, props: { r: 30 } },
    { u: 6, v: 6, type: sd.CircleCurve, props: { r: 30 } },
    { u: 3, v: 6, type: sd.Line, props: { dy: 3 } },
    { u: 7, v: 2, type: sd.Line, props: { dy: 3 } },
    { u: 4, v: 2, type: sd.Curve, props: { bending: -0.5 } },
    { u: 5, v: 4, type: sd.Curve, props: {} },
    { u: 9, v: 7, type: sd.Curve, props: {} },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.5, dx: 3 } },
];

function makeLink(links, du, dv, u, v) {
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            line.source(du.center());
            line.target(dv.center());
            for (let key in links[i].props) {
                line[key](links[i].props[key]);
            }
            return line;
        }
    }
    return new links[0].type(svg).source(du.center()).target(dv.center());
}

sd.init(() => {
    buildTrieTreeSync(ac, data, {
        onLink: (u, v) => ac.element(u, v).arrow(),
        onReachEndOfString: u => ac.element(u).strokeWidth(3),
    });
    buildTrieGraphSync(ac, "ab", {
        onLink,
    });
    arr.x(ac.mx() + 20);
    ans.x(ac.mx() + 20).my(ac.cy() - 20);
    path.x(ac.mx() + 20).y(ac.cy() + 20);
});

sd.main(async () => {
    await sd.pause();
    let u = 1;
    focus.startAnimate().focus(u).endAnimate();
    for (let i = 1; i <= arr.length(); i++) {
        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.blue);
        if (i > 1) arr.color(i - 1, C.white);
        arr.endAnimate();

        const character = arr.text(i);
        u = ac.element(u).acch[character];

        await sd.pause();
        focus.startAnimate().focus(u).endAnimate();
        path.startAnimate().push(u).endAnimate();
        ans.startAnimate().push(character).endAnimate();

        if (ac.element(u).is_end) {
            const length = ac.depth(u) - 1;
            await sd.pause();
            path.startAnimate()
                .color(path.length() - length + 1, path.length(), C.red)
                .endAnimate();
            ans.startAnimate()
                .color(path.length() - length + 1, ans.length(), C.red)
                .endAnimate();
            await sd.pause();
            for (let j = 1; j <= length; j++) {
                path.startAnimate().pop().endAnimate();
                ans.startAnimate().pop().endAnimate();
            }
            u = path.length() ? path.lastElement().intValue() : 1;
            focus.startAnimate().focus(u).endAnimate();
        }
    }
});

async function onLink(u, v, character) {
    if (character) {
        const du = ac.element(u);
        const dv = ac.element(v);
        const line = makeLink(links1, du, dv, u, v).arrow();
        line.value(character, R.pointAtPathByRate(0.3, "x", "cy"));
        sd.trim(line, du, dv);
    }
}

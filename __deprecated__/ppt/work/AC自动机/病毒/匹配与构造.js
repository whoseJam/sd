import * as sd from "@/sd";

import { buildTrieGraphSync } from "../_/BuildTrieGraphSync";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = new sd.Focus(ac);
const arr = new sd.Array(svg).start(1).pushArray("ababb");
const constructedArr = new sd.Array(svg).start(1);
const constructed = "abbab";
const pI = sd.Pointer(arr, "i", "t");
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
    constructedArr.x(ac.mx() + 20).y(100);
});

sd.main(async () => {
    await sd.pause();
    let u = 1;
    focus.startAnimate().focus(u).endAnimate();
    for (let i = 1; i <= arr.length(); i++) {
        await sd.pause();
        pI.startAnimate().moveTo(i).endAnimate();

        const character = arr.text(i);
        u = ac.element(u).acch[character];

        await sd.pause();
        focus.startAnimate().focus(u).endAnimate();

        if (ac.element(u).is_end) {
            const length = ac.depth(u) - 1;
            await sd.pause();
            arr.startAnimate()
                .color(i - length + 1, i, C.red)
                .endAnimate();
            await sd.pause();
            arr.startAnimate()
                .color(i - length + 1, i, C.white)
                .endAnimate();
        }
    }
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
    pI.startAnimate().moveTo(null).endAnimate();

    await sd.pause();
    u = 1;
    focus.startAnimate().focus(1).endAnimate();
    for (let i = 0; i < constructed.length; i++) {
        await sd.pause();
        const character = constructed[i];
        u = ac.element(u).acch[character];
        focus.startAnimate().focus(u).endAnimate();
        constructedArr.startAnimate().push(character).endAnimate();
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

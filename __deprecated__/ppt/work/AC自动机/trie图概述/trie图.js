import * as sd from "@/sd";

import { buildTrieGraph } from "../_/BuildTrieGraph";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const ac = new sd.Tree(svg).layerHeight(70).x(100).y(100);
const pu = sd.Pointer(ac, "u", "l");
const pf = sd.Pointer(ac, "f", "r");
const pv = sd.Pointer(ac, "v", "l");
const focus = new sd.Focus(ac);
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
const links2 = [
    // format
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 6, v: 1, type: sd.Curve, props: { bending: 0.3 } },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.5 } },
];

function makeLink(links, u, v) {
    const du = ac.element(u);
    const dv = ac.element(v);
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            line.source(du.center());
            line.target(dv.center());
            for (let key in links[i].props) line[key](links[i].props[key]);
            return line;
        }
    }
    const line = new links[0].type(svg);
    line.source(du.center());
    line.target(dv.center());
    return line;
}

sd.init(() => {
    buildTrieTreeSync(ac, data, {
        onLink: (u, v) => {
            ac.element(u, v).arrow();
        },
    });
    ac.forEachNode(node => {
        node.links = {};
    });
});

sd.main(async () => {
    await buildTrieGraph(ac, "ab", {
        onLink,
        onStartBuild: async u => {
            await sd.pause();
            pu.startAnimate().moveTo(u).endAnimate();
            focus.startAnimate().focus(u).endAnimate();
        },
        onStartBuildChild: async v => {
            await sd.pause();
            pv.startAnimate().moveTo(v).endAnimate();
            ac.startAnimate().color(v, C.blue).endAnimate();
        },
        onEndBuildChild: async v => {
            await sd.pause();
            pv.startAnimate().opacity(0).endAnimate();
            ac.startAnimate().color(v, C.white).endAnimate();
        },
    });
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
});

async function onLink(v, vf, character) {
    function colorLink(u, character, color) {
        const du = ac.element(u);
        if (du.links[character]) du.links[character].startAnimate().stroke(color).endAnimate();
        else ac.element(u, du.acch[character]).startAnimate().stroke(color).endAnimate();
    }
    const u = character ? v : +ac.fatherId(v);
    const du = ac.element(u);
    const dv = ac.element(v);
    const dvf = ac.element(vf);
    if (du.fail) {
        await sd.pause();
        pf.startAnimate().moveTo(du.fail).endAnimate();
        if (character) {
            await sd.pause();
            colorLink(du.fail, character, C.textBlue);
        } else {
            await sd.pause();
            colorLink(du.fail, ac.text(u, v), C.textBlue);
            colorLink(u, ac.text(u, v), C.textBlue);
        }
    }

    await sd.pause();
    const line = makeLink(character ? links1 : links2, v, vf).arrow();
    if (character) line.value(character, R.pointAtPathByRate(0.3, "x", "cy"));
    else line.strokeDashArray([5, 5]);
    sd.trim(line, dv, dvf);
    line.opacity(0).startAnimate().opacity(1).endAnimate();
    if (character) dv.links[character] = line;

    if (du.fail) {
        await sd.pause();
        pf.startAnimate().opacity(0).endAnimate();
        if (character) {
            colorLink(du.fail, character, C.black);
        } else {
            colorLink(du.fail, ac.text(u, v), C.black);
            colorLink(u, ac.text(u, v), C.black);
        }
    }
}

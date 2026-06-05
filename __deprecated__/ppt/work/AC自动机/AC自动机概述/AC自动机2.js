import * as sd from "@/sd";

import { buildFailTree } from "../_/BuildFailTree";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const parentFocus = sd.Focus(ac);
const failFocus = sd.Focus(ac);
const data = ["abab", "babb"];

let failChainU;
let failChainV;

const links = [
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 6, v: 1, type: sd.Curve, props: { bending: 0.3 } },
    { u: 9, v: 6, type: sd.Curve, props: { bending: 0.3 } },
];

function makeLink(u, v) {
    for (let i = 1; i < links.length; i++) {
        if (links[i].u == u && links[i].v == v) {
            const line = new links[i].type(svg);
            for (let key in links[i].props) {
                line[key](links[i].props[key]);
            }
            return line;
        }
    }
    return new links[0].type(svg);
}

sd.init(() => {
    buildTrieTreeSync(ac, data);
});

sd.main(async () => {
    await sd.pause();
    ac.forEachNode((node, idx) => {
        if (idx === "1") return;
        sd.Label(node, node.str, node.cx() < ac.root().cx() ? "lc" : "rc", 20, 3)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
    });

    await buildFailTree(ac, {
        onLink,
        onStartBuild: async u => {
            await sd.pause();
            parentFocus.startAnimate().focus(u).endAnimate();
            failFocus.focus(null).after(parentFocus).focus(u);
        },
        onStartBuildChild: async v => {
            await sd.pause();
            ac.startAnimate().color(v, C.blue).endAnimate();
        },
        onEndBuildChild: async v => {
            await sd.pause();
            ac.startAnimate().color(v, C.white).endAnimate();
        },
        onFailJumpTo,
    });

    await sd.pause();
    parentFocus.startAnimate().focus(null).endAnimate();
    failFocus.startAnimate().focus(null).endAnimate();
});

async function onFailJumpTo(fail, parent, first) {
    await sd.pause();
    const length = ac.depth(fail);
    failFocus.startAnimate().focus(fail).endAnimate();
    if (first) {
        failChainU = makePath(parent, length, C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        failChainV = makePath(fail, length, C.darkOrange).startAnimate().pointStoT().endAnimate().arrow();
    } else {
        failChainU.startAnimate().d(makePathD(parent, length)).endAnimate();
        failChainV.startAnimate().d(makePathD(fail, length)).endAnimate();
    }
}

async function onLink(u, v) {
    if (v != 1) {
        await sd.pause();
        const length = ac.depth(v);
        failChainU.startAnimate().d(makePathD(u, length)).endAnimate();
        failChainV.startAnimate().d(makePathD(v, length)).endAnimate();
        ac.startAnimate().color(v, C.orange).endAnimate();
    }

    await sd.pause();
    const line = makeLink(u, v);
    const du = ac.element(u);
    const dv = ac.element(v);
    line.source(du.center());
    line.target(dv.center());
    line.arrow();
    line.strokeDashArray([5, 5]);
    line.opacity(0);
    sd.trim(line, du, dv);
    line.startAnimate().opacity(1).endAnimate();

    if (v != 1) {
        await sd.pause();
        failFocus.startAnimate().focus(null).endAnimate();
        ac.startAnimate().color(v, C.white).endAnimate();
        failChainU.startAnimate().opacity(0).endAnimate().remove();
        failChainV.startAnimate().opacity(0).endAnimate().remove();
    }
}

function makePath(u, length, color = C.black) {
    return new sd.Path(svg).d(makePathD(u, length).toString()).stroke(color).strokeWidth(2);
}

function makePathD(u, length) {
    function getPath(u, length) {
        const path = [];
        for (let i = 1; i <= length; i++) {
            path.push(ac.element(u));
            u = ac.fatherId(u);
        }
        return path.reverse();
    }
    const path = getPath(u, length);
    const pen = new sd.PathPen();
    pen.MoveTo(path[0].center());
    for (let i = 1; i < path.length; i++) {
        pen.LineTo(path[i].center());
    }
    return pen.toString();
}

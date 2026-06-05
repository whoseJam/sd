import * as sd from "@/sd";

import { buildFailTree } from "../_/BuildFailTree";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const ac = new sd.Tree(svg).layerHeight(70);
const focus = sd.Focus(ac);
const data = ["aba", "bab"];
const links = [
    // format
    { type: sd.Line },
    { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } },
    { u: 5, v: 1, type: sd.Curve, props: { bending: 0.3 } },
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
        onStartBuildChild,
    });

    focus.startAnimate().focus(null).endAnimate();
});

async function onLink(u, v) {
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
}

async function onStartBuildChild(v) {
    await sd.pause();
    focus.startAnimate().focus(v).endAnimate();
}

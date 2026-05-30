import * as sd from "@/sd";

import { buildFailTreeSync } from "../_/BuildFailTreeSync";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(70);
const data = ["ababa", "babb"];

const links = [{ type: sd.Line }, { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } }, { u: 7, v: 1, type: sd.Curve, props: { bending: 0.3 } }, { u: 6, v: 4, type: sd.Curve, props: { bending: -0.3 } }, { u: 10, v: 7, type: sd.Curve, props: { bending: 0.3 } }];

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

sd.init(async () => {
    buildTrieTreeSync(ac, data);
    buildFailTreeSync(ac, {
        onLink,
    });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    ac.forEachNode((node, id) => {
        if (node.cx() < ac.cx()) {
            sd.Label(node, node.str, "lc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
        } else {
            sd.Label(node, node.str, "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
        }
    });

    ac.forEachNode((node, id) => {
        node.onClick(() => {
            sd.inter(async () => {
                let f = id;
                const path = [f];
                while (ac.fatherId(f)) {
                    f = ac.fatherId(f);
                    path.push(f);
                }
                for (let i = path.length - 1; i >= 0; i--) ac.startAnimate().color(path[i], C.green).endAnimate();
                await sd.pause();
                for (let i = path.length - 1; i >= 0; i--) ac.startAnimate().color(path[i], C.white).endAnimate();
            });
        });
        node.onDblClick(() => {
            sd.inter(async () => {
                let f = id;
                ac.startAnimate().color(f, C.green).endAnimate();
                while (ac.element(f).fail) {
                    f = ac.element(f).fail;
                    ac.startAnimate().color(f, C.green).endAnimate();
                }
                await sd.pause();
                f = id;
                ac.startAnimate().color(f, C.white).endAnimate();
                while (ac.element(f).fail) {
                    f = ac.element(f).fail;
                    ac.startAnimate().color(f, C.white).endAnimate();
                }
            });
        });
    });
});

function onLink(u, v) {
    const line = makeLink(u, v);
    const du = ac.element(u);
    const dv = ac.element(v);
    line.source(du.center());
    line.target(dv.center());
    line.arrow();
    line.strokeDashArray([5, 5]);
    sd.trim(line, du, dv);
}

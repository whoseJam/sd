import * as sd from "@/sd";
import { buildFailTreeSync } from "../_/BuildFailTreeSync";
import { buildTrieTreeSync } from "../_/BuildTrieTreeSync";
import { matchOnACMachine } from "../_/MatchOnACMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const ac = new sd.Tree(svg).layerHeight(90).width(600);
const target = "abaa";
const arr = new sd.Array(svg).pushArray(target);
const pointer = sd.Pointer(arr, "i", "t");
const focus = sd.Focus(ac);
const brace = sd.Brace(arr);
const data = ["aba", "ba", "aa", "bb", "b"];

const links = [{ type: sd.Line }, { u: 2, v: 1, type: sd.Curve, props: { bending: -0.3 } }, { u: 5, v: 1, type: sd.Curve, props: { bending: 0.3 } }, { u: 7, v: 2, type: sd.Curve, props: { bending: -0.3 } }, { u: 8, v: 5, type: sd.Curve, props: { bending: 0.3 } }];

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
    buildTrieTreeSync(ac, data, { onReachEndOfString: u => ac.element(u).strokeWidth(3) });
    buildFailTreeSync(ac, { onLink });

    ac.forEachNode((node, id) => {
        if (id === "1") return;
        if (node.cx() < ac.father(node).cx() || (node.cx() === ac.father(node).cx() && node.cx() < ac.cx())) {
            sd.Label(node, node.str, "lc");
        } else {
            sd.Label(node, node.str, "rc");
        }
    });
    arr.x(ac.mx()).cy(ac.cy());
});

sd.main(async () => {
    await matchOnACMachine(ac, arr, {
        onStartMatch,
        onStartMatchAt,
        onFailJumpTo,
        onMatchExtended,
        onMatchFailed,
    });
});

async function onStartMatch() {
    await sd.pause();
    ac.startAnimate().color(1, C.green).endAnimate();
    focus.startAnimate().focus(1).endAnimate();
}

async function onStartMatchAt(i) {
    await sd.pause();
    pointer.startAnimate().moveTo(i).endAnimate();
}

async function onFailJumpTo(nextFail, prevFail, i) {
    const nextLength = ac.depth(nextFail);
    const prevLength = ac.depth(prevFail);
    if (nextFail) {
        await sd.pause();
        focus.startAnimate().focus(nextFail).endAnimate();
        brace
            .startAnimate()
            .brace(i - nextLength + 1, i - 1)
            .endAnimate();
        arr.startAnimate();
        arr.color(i - prevLength + 1, i - nextLength, C.white);
        arr.color(i, C.red);
        arr.endAnimate();
    }
}

async function onMatchExtended(u, i) {
    await sd.pause();
    const length = ac.depth(u) - 3;
    focus.startAnimate().focus(u).endAnimate();
    ac.startAnimate().color(u, C.green).endAnimate();
    brace
        .startAnimate()
        .brace(i - length - 1, i)
        .endAnimate();
    arr.startAnimate().color(i, C.green).endAnimate();
}

async function onMatchFailed(u, i) {
    brace.startAnimate().opacity(0).endAnimate();
}

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

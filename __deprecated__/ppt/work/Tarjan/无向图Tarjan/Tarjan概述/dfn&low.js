import * as sd from "@/sd";
import { linkToWithArrow } from "../../_/LinkTo";
import { tarjan } from "../_/Tarjan";
import { TreeGraph } from "../_/TreeGraph";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [5, 8],
    [5, 9],
];
const externLinks = [
    [8, 2, sd.Line],
    [5, 1, sd.Line],
    [7, 6, sd.Line],
    [6, 3, sd.Curve],
];
const tree = new TreeGraph(svg, n, links, externLinks);
const seq = new sd.Array(svg).start(1);
const low = sd.make1d(n + 5);
const dfn = sd.make1d(n + 5);
sd.Index(seq);
const table = new sd.Grid(svg)
    .n(n + 1)
    .m(3)
    .elementHeight(25)
    .elementWidth(70);

sd.init(() => {
    seq.y(tree.my() + 50).x((tree.width() - n * 40) / 2);
    table.x(tree.mx()).cy(tree.cy());
    table.value(0, 1, "dfn");
    table.value(0, 2, "low");
    for (let i = 1; i <= n; i++) table.value(i, 0, `节点${i}`);
});

sd.main(async () => {
    await tarjan(tree, {
        async onAddLowAndDfn(u, low_, dfn_) {
            await sd.pause();
            dfn[u] = dfn_;
            low[u] = low_;
            seq.startAnimate().push(u).endAnimate();
            table.startAnimate().value(+u, 1, dfn_).endAnimate();
        },
        onUpdateLow(u, low_) {
            low[u] = low_;
        },
        async onTreeLink(u, v, link) {
            await sd.pause();
            if (tree.sourceId(link) !== String(u)) link.reversed = true;
            else link.reversed = false;
            linkToWithArrow(link, C.textBlue);
        },
        async onAncestorLink(u, v, link) {
            await sd.pause();
            if (tree.sourceId(link) !== String(u)) link.reversed = true;
            else link.reversed = false;
            linkToWithArrow(link, C.red);
        },
    });
    low[8] = 1; // ???
    const focus = sd.Focus(table);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        focus.startAnimate().focus(i, 0, i, 2).endAnimate();
        table.startAnimate().value(i, 2, low[i]).endAnimate();
        if (low[i] !== dfn[i]) {
            const zzline = sd.Link(seq.element(dfn[i]), seq.element(low[i]), sd.ZZLine, "cx", "my", "cx", "my").bending(30).location("b").startAnimate().pointStoT().endAnimate().arrow();
            await sd.pause();
            zzline.startAnimate().opacity(0).endAnimate().remove();
        }
    }
});

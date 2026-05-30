import * as sd from "@/sd";
import { mergeArrayOnTree } from "../_/MergeArrayOnTree";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).x(100).width(400).layerHeight(80);
const n = 5;
const power = [4, 2, 1, 3, 5];
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
];

sd.init(() => {
    power.forEach((p, id) => {
        tree.newNode(id + 1, p);
    });
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {
    await sd.pause();
    tree.forEachNode(node => {
        const power = node.intValue();
        node.startAnimate().childAs("arr", new sd.Array(svg).elementWidth(15).elementHeight(15).resize(n).start(1).value(power, 1), R.aside("tc")).endAnimate();
    });
    await mergeArrayOnTree(tree, {
        onMergeArray,
    });
    await sd.pause();
    tree.forEachNode(node => {
        const power = node.intValue();
        if (power + 1 <= n) {
            sd.Brace(node.child("arr"))
                .brace(power + 1, n, "t")
                .startAnimate()
                .pointStoT()
                .endAnimate();
        }
    });
});

async function onMergeArray(u, v) {
    const du = tree.element(u);
    const dv = tree.element(v);
    const au = du.child("arr");
    const av = dv.child("arr");
    await sd.pause();
    const link = sd.Link(av, au).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    au.forEachElement((element, id) => {
        element
            .startAnimate()
            .value(element.intValue() + av.intValue(id))
            .endAnimate();
    });
    await sd.pause();
    link.startAnimate().fadeStoT().endAnimate().remove();
}

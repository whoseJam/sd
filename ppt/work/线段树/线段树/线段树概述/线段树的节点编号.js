import * as sd from "@/sd";
import { SegmentTree } from "../_/SegmentTree";

const svg = sd.svg();
const R = sd.rule();
const n = 4;
const tree = new SegmentTree(svg, 1, n).layerHeight(90);

sd.init(() => {
    tree.forEachNode((node, x) => {
        node.childAs(new sd.Text(node, `id=${x}`), R.aside("tc", 0));
    });
});

sd.main(async () => {});

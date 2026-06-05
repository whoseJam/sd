import * as sd from "@/sd";

import { buildFailTreeFromLen } from "../_/BuildFailTreeFromLen";
import { buildLenSync } from "../_/BuildLenSync";

const svg = sd.svg();
const R = sd.rule();
const str = " abcabcabc";
const n = str.length - 1;
const arr = new sd.Array(svg);
const kText = new sd.Text(svg, "k=2").x(100).y(90);
const gap = 5;
const locations = [
    // locations
    {},
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
];
const len = buildLenSync(str);

sd.init(() => {
    for (let i = 0; i <= n; i++) arr.push(str[i]);
    for (let i = 0; i <= n; i++) arr.element(i).childAs(new sd.Text(svg, i).fontSize(12), R.aside("bc", 3));
    arr.x(100).cy(300);
});

sd.main(async () => {
    await buildFailTreeFromLen(arr, len, locations, {
        onCreateTree,
    });
});

function onCreateTree(tree) {
    tree.layerWidth(150).height(500).x(arr.x()).cy(arr.cy());
}

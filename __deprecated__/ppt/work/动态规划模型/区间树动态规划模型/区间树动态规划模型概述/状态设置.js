import * as sd from "@/sd";
import { IntervalSubtree } from "../_/IntervalSubtree";

const svg = sd.svg();
const R = sd.rule();
const tree = new IntervalSubtree(svg);

sd.init(() => {
    sd.Label(tree, "l", "lt");
    sd.Label(tree, "r", "rt");
});

sd.main(async () => {
    await sd.pause();
    tree.child("subtree").startAnimate().value("?", R.center()).endAnimate();
});

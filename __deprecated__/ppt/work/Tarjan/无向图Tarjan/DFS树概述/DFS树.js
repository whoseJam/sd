import * as sd from "@/sd";
import { linkToWithArrow } from "../../_/LinkTo";
import { HugeGraph } from "../_/HugeGraph";
import { tarjanForNestedGraph } from "../_/Tarjan";

const svg = sd.svg();
const C = sd.color();
const grid = new HugeGraph(svg);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    await tarjanForNestedGraph(grid, {
        onTreeLink(u, v, link) {
            linkToWithArrow(link, C.textBlue);
        },
        onAncestorLink(u, v, link) {
            linkToWithArrow(link, C.red);
        },
    });
});

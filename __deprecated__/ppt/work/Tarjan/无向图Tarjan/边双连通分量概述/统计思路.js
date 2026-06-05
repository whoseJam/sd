import * as sd from "@/sd";
import { linkToWithArrow } from "../../_/LinkTo";
import { HugeGraph } from "../_/HugeGraph";
import { tarjanForNestedGraph } from "../_/Tarjan";

const svg = sd.svg();
const C = sd.color();
const grid = new HugeGraph(svg);
const stack = new sd.Stack(svg).dx(-180).elementHeight(30).elementWidth(80);
const colorList = [C.orange, C.blue, C.green, C.red, C.yellow];
const BCC = [];
const seq = [];
let tot = 0;

function isBCC(u) {
    return (
        BCC.filter(BCC => {
            return String(BCC[0]) === String(u[0]) && String(BCC[1]) === String(u[1]);
        }).length >= 1
    );
}

sd.init(() => {
    stack.y(grid.node(1, 1).y());
});

sd.main(async () => {
    await sd.pause();
    await tarjanForNestedGraph(grid, {
        onAddLowAndDfn(u) {
            seq.push(u);
        },
        onTreeLink(u, v, link) {
            linkToWithArrow(link, C.textBlue);
        },
        onAncestorLink(u, v, link) {
            linkToWithArrow(link, C.red);
        },
        onBCC(u) {
            BCC.push(u);
            seq.push("pop");
        },
    });
    await sd.pause();
    grid.startAnimate();
    BCC.forEach(BCC => {
        grid.node(BCC[0], BCC[1]).color(C.green);
    });
    grid.endAnimate();
    await sd.pause();
    grid.startAnimate();
    BCC.forEach(BCC => {
        grid.node(BCC[0], BCC[1]).color(C.white).strokeWidth(3);
    });
    grid.endAnimate();

    await sd.pause();
    for (const u of seq) {
        if (u === "pop") {
            const color = colorList.pop();
            while (stack.length() > 0) {
                await sd.pause();
                const last = stack.lastElement().u;
                stack.startAnimate();
                stack.color(stack.end(), color);
                stack.endAnimate();
                grid.node(last[0], last[1]).startAnimate().color(color).endAnimate();
                await sd.pause();
                stack.startAnimate().pop().endAnimate();
                if (isBCC(last)) break;
            }
        } else {
            await sd.pause();
            const [g, x] = u;
            grid.node(g, x).startAnimate().value(++tot).endAnimate();
            stack.startAnimate().push(tot).endAnimate();
            stack.lastElement().u = u;
        }
    }
});

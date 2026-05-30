import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.BoxTree(svg).width(500).elementWidth(60).elementHeight(30);
let tot = 0;

sd.init(() => {
    f(5);
    tree.forEachLink(link => link.opacity(0));
    tree.forEachNode(node => node.opacity(0));
    tree.nodeOpacity(1, 1);
    tree.element(1).onClick(() => {
        sd.inter(async () => {
            await clickNode(1);
        });
    });
});

sd.main(async () => {});

function f(x) {
    const current = ++tot;
    tree.newNode(current, `f(${x})`);
    if (x <= 2) return current;
    tree.link(current, f(x - 1));
    tree.link(current, f(x - 2));
    return current;
}

async function clickNode(x) {
    const element = tree.element(x);
    element.onClick(null);
    tree.children(element).forEach(child => {
        const link = tree.element(x, child);
        link.opacity(1).startAnimate().pointStoT().endAnimate();
        child.startAnimate().opacity(1).endAnimate();
        child.onClick(() => {
            sd.inter(async () => {
                await clickNode(tree.nodeId(child));
            });
        });
    });
    if (tree.children(element).length === 0) {
        element.startAnimate().color(C.orange).endAnimate();
    }
}

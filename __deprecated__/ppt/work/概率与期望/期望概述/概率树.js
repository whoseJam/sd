import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const tree = new sd.Tree(svg);
const nodes = [2, 1, 3, 2, 1];
const E1 = new sd.Math(svg, "E(X)=").fontSize(15).x(300);
const c1 = E1.cy();
const n = nodes.length;
const locations = [
    R.aside("tc"),
    (parent, child) => {
        child.mx(parent.x()).my(parent.y());
    },
    R.aside("rc"),
    R.aside("lc"),
    R.aside("rc"),
];
const computed = {
    2: "\\frac{5}{2}",
    1: "\\frac{29}{6}",
};
const links = [
    [1, 2, "\\frac{1}{3}", "mx"],
    [1, 3, "\\frac{2}{3}", "x"],
    [2, 4, "\\frac{1}{2}", "mx"],
    [2, 5, "\\frac{1}{2}", "x"],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) tree.newNode(i, nodes[i - 1]);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1])
            .value(new sd.Math(svg, link[2]).fontSize(10), R.pointAtPathByRate(0.5, link[3], "my"))
            .arrow();
    });
});

sd.main(async () => {
    const leaves = [];
    tree.forEachNode(node => {
        if (tree.children(node).length === 0) leaves.push(node);
    });
    for (const leaf of leaves) {
        await sd.pause();
        const nodes = tree.nodesOnPath(1, leaf);
        const path = new sd.Path(svg)
            .d(drawPath(nodes))
            .stroke(C.red)
            .startAnimate(300 * (nodes.length - 1))
            .pointStoT()
            .endAnimate()
            .arrow();
        await sd.pause();
        let sum = 0;
        tree.forEachNodeOnPath(1, leaf, node => {
            sum += node.intValue();
        });
        let ans = String(sum);
        tree.forEachLinkOnPath(1, leaf, link => {
            ans = ans + link.text();
        });
        if (leaf !== leaves[0]) ans = "+" + ans;
        E1.text(E1.text() + ans, [[E1.text(), E1.text()]]).cy(c1);
        await sd.pause();
        path.startAnimate().fadeStoT().endAnimate().remove();
    }
    await sd.pause();
    E1.startAnimate().text("E(X)=\\frac{29}{6}").endAnimate();
    await sd.pause();
    await dfs(1);
});

async function dfs(u) {
    if (tree.children(u).length === 0) {
        await sd.pause();
        tree.element(u)
            .startAnimate()
            .color(C.blue)
            .childAs("math", new sd.Math(tree, tree.intValue(u)).fontSize(15), locations[u - 1])
            .endAnimate();
    }
    const children = tree.children(u);
    let sum = String(tree.intValue(u));
    for (let i = 0; i < children.length; i++) {
        await dfs(tree.nodeId(children[i]));
        sum += "+" + children[i].child("math").text() + tree.text(u, children[i]);
    }
    await sd.pause();
    tree.element(u)
        .startAnimate()
        .color(C.blue)
        .childAs("math", new sd.Math(tree, sum).fontSize(15), locations[u - 1])
        .endAnimate();
    if (computed[u]) {
        await sd.pause();
        tree.element(u).child("math").startAnimate().text(computed[u]).endAnimate();
    }
}

function drawPath(nodes) {
    const pen = new sd.PathPen(svg).MoveTo(nodes[0].center());
    for (let i = 1; i < nodes.length; i++) pen.LineTo(nodes[i].center());
    return pen.toString();
}

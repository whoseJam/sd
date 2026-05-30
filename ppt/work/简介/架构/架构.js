import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const tree = new sd.Tree(svg).dx(400).layerHeight(80);
const rend = new sd.Tree(svg).layerHeight(80);
const n = 10;
const animation = 3;
const at = 10;
const links = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [4, 8],
    [6, 9],
    [7, 10],
];

sd.init(() => {
    sd.Label(tree, "场景树", "tc", 20, 25);
    sd.Label(rend, "渲染树", "tc", 20, 25);
    for (let i = 1; i <= n; i++) {
        tree.newNode(i, "");
        rend.newNode(i, "");
    }
    links.forEach(link => {
        tree.link(link[0], link[1]);
        rend.link(link[0], link[1]);
    });
});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        tree.element(i)
            .after((i - 1) * 600)
            .startAnimate()
            .color(C.green)
            .endAnimate()
            .startAnimate()
            .color(C.white)
            .endAnimate();
        rend.element(i)
            .after((i - 1) * 600)
            .startAnimate()
            .color(C.green)
            .endAnimate()
            .startAnimate()
            .color(C.white)
            .endAnimate();
        sd.Link(tree.element(i), rend.element(i), sd.Curve)
            .opacity(0)
            .after((i - 1) * 600)
            .opacity(1)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow()
            .startAnimate()
            .fadeStoT()
            .endAnimate()
            .remove();
    }
    await sd.pause();
    const focus = sd.Focus(rend).gap(23).startAnimate().focus().endAnimate();
    await sd.pause();
    const code = new sd.Code(svg).push("x,y,w,h").push("color").push("opacity").fontSize(10);
    sd.Aside(rend.element(at), code, "rc").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    const link = sd.Link(tree.element(at), code, sd.Curve).bending(0.2).startAnimate().pointStoT().endAnimate().arrow();
    link.startAnimate().value(makeAction(), R.pointAtPathByRate(0.5, "cx", "y", 0, 5)).endAnimate();
    await sd.pause();
    link.startAnimate();
    link.value().dy(10).opacity(0);
    link.value(null);
    link.endAnimate();
    await sd.pause();
    link.startAnimate().fadeStoT().endAnimate().remove();
    await sd.pause();
    tree.startAnimate().value(animation, "o").endAnimate();
    await sd.pause();
    tree.forEachNodeInSubtree(animation, (node, id) => {
        tree.startAnimate().color(id, C.green).endAnimate();
    });
    await sd.pause();
    tree.forEachNodeInSubtree(animation, (node, id) => {
        node.startAnimate().childAs("reactive", new sd.Box(node, "vars").width(50).height(20).onEnter(EN.appear()), R.aside("tc", 1)).endAnimate();
    });
    await sd.pause();
    tree.forEachLinkInSubtree(animation, (link, sourceId, targetId) => {
        const line = sd.Link(tree.element(sourceId).child("reactive"), tree.element(targetId).child("reactive"));
        line.startAnimate().pointStoT().endAnimate().arrow();
        link.line = line;
    });
    tree.forEachNodeInSubtree(animation, (node, id) => {
        const line = sd.Link(node.child("reactive"), rend.element(id), sd.Curve).bending(0.2).opacity(0).after(300).opacity(1);
        line.startAnimate().pointStoT().endAnimate().arrow();
        node.line = line;
    });
    rend.forEachNodeInSubtree(animation, node => node.after(600).startAnimate().color(C.blue).endAnimate());
    await sd.pause();
    tree.forEachNodeInSubtree(animation, (node, id) => {
        const line = node.line;
        const action = makeAction();
        action.center(line.at(0)).startAnimate().opacity(1).endAnimate();
        const callback = function (t) {
            const k = this.source * (1 - t) + this.target * t;
            action.center(line.at(k));
        };
        new sd.Action(300, 600, 0, 1, callback, action, "xxx");
        node.action = action;
    });
    await sd.pause();
    tree.forEachNodeInSubtree(animation, node => {
        node.action.startAnimate().dy(-10).opacity(0).endAnimate().remove();
    });
    await sd.pause();
    tree.forEachLinkInSubtree(animation, link => {
        link.line.startAnimate().fadeStoT().endAnimate().remove();
    });
    tree.forEachNodeInSubtree(animation, (node, id) => {
        node.line.startAnimate().fadeStoT().endAnimate().remove();
    });
});

function makeAction() {
    return new sd.Box(svg, "Action").height(20).width(50).opacity(0);
}

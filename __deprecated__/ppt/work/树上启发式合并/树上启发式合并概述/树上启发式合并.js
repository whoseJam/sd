import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const focus = sd.Focus(tree);
const layer = svg.append("g");

sd.init(() => {
    tree.root("f");
    tree.link("f", "u");
    tree.link("u", "S");
    tree.link("u", "a");
    tree.link("u", "b");
    for (let v of ["S", "a", "b"]) {
        const dv = tree.element(v);

        const rct = new sd.Rect(svg);
        if (v === "S") rct.height(140).width(80);
        else rct.height(80).width(50);
        dv.childAs("rect", rct, (parent, child) => {
            child.cx(parent.cx());
            child.y(parent.cy());
        });
        rct.attachTo(layer);
    }
    tree.cx(600).cy(300);
});

sd.main(async () => {
    await sd.pause();
    focus.startAnimate().focus("u").endAnimate();
    await sd.pause();
    tree.startAnimate();
    colorNode("a", C.green);
    tree.endAnimate();

    await sd.pause();
    tree.startAnimate();
    colorNode("a", C.white);
    tree.endAnimate();

    await sd.pause();
    tree.startAnimate();
    colorNode("b", C.green);
    tree.endAnimate();

    await sd.pause();
    tree.startAnimate();
    colorNode("b", C.white);
    tree.endAnimate();

    await sd.pause();
    tree.startAnimate();
    colorNode("S", C.green);
    tree.endAnimate();

    await sd.pause();
    tree.startAnimate();
    colorNode("a", C.green);
    colorNode("b", C.green);
    tree.endAnimate();

    await sd.pause();
    tree.startAnimate().color("u", C.green).endAnimate();
});

function colorNode(u, col) {
    const du = tree.element(u);
    const r = du.child("rect");
    du.color(col);
    if (r) r.color(col);
}

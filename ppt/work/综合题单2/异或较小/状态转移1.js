import * as sd from "@/sd";

const svg = sd.svg();
const EN = sd.enter();
const V = sd.vec();
const C = sd.color();
const R = sd.rule();

function makeTree(label) {
    const s1 = new sd.Triangle(svg).width(120).height(160);
    const s2 = new sd.Triangle(svg).width(120).height(160);
    const tree = new sd.BinaryTree(svg).width(400).layerHeight(80);
    const line = new sd.Line(svg).value("?");
    tree.root(1).element(1).value(math(label), R.center());
    tree.leftChild(1, 2)
        .element(2)
        .value(math(`lc(${label})`), R.center());
    tree.element(1, 2).value(0, R.pointAtPathByRate(0.5, "mx", "cy", -5));
    tree.rightChild(1, 3)
        .element(3)
        .value(math(`rc(${label})`), R.center());
    tree.element(1, 3).value(1, R.pointAtPathByRate(0.5, "x", "cy", 5));
    tree.element(2).childAs(s1.onEnter(EN.nothing()), (parent, child) => {
        child.cx(parent.cx()).y(parent.cy());
    });
    tree.element(3).childAs(s2.onEnter(EN.nothing()), (parent, child) => {
        child.cx(parent.cx()).y(parent.cy());
    });
    tree.element(1).childAs(line, (parent, child) => {
        child.mx(parent.cx() - parent.r() / Math.sqrt(2)).my(parent.cy() - parent.r() / Math.sqrt(2));
    });
    return tree;
}

sd.init(() => {
    makeTree("x");
});

sd.main(async () => {});

function math(str) {
    return new sd.Math(svg, str).fontSize(str.length === 1 ? 16 : 13);
}

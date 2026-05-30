import * as sd from "@/sd";

const svg = sd.svg();
const EN = sd.enter();
const R = sd.rule();

sd.init(() => {
    makeTree();
});

sd.main(async () => {});

function makeTree() {
    const s1 = new sd.Triangle(svg).width(120).height(160);
    const s2 = new sd.Triangle(svg).width(120).height(160);
    const tree = new sd.BinaryTree(svg).width(400).layerHeight(80);
    tree.root(1).element(1).value(math("u"), R.center());
    tree.leftChild(1, 2).element(2).value(math(`...`), R.center());
    tree.rightChild(1, 3).element(3).value(math(`v`), R.center());
    tree.element(2).childAs(s1.onEnter(EN.nothing()), (parent, child) => {
        child.cx(parent.cx()).y(parent.cy());
    });
    tree.element(3).childAs(s2.onEnter(EN.nothing()), (parent, child) => {
        child.cx(parent.cx()).y(parent.cy());
    });
    return tree;
}

function math(str) {
    return new sd.Math(svg, str).fontSize(20);
}

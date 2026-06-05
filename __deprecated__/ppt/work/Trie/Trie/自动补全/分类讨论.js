import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter();
const subtree = [new sd.Triangle(svg), new sd.Triangle(svg), new sd.Triangle(svg)];
const tree = new sd.Tree(svg).width(500);

sd.init(() => {
    tree.link(1, 2).link(1, 3).link(1, 4);
    addSubtree(2, subtree[0]);
    addSubtree(3, subtree[1]);
    addSubtree(4, subtree[2]);
});

sd.main(async () => {});

function addSubtree(x, subtree) {
    const vertex = tree.element(x);
    vertex.childAs(subtree.onEnter(EN.nothing()), (parent, child) => {
        child.width(100).height(150).cx(parent.cx()).y(parent.cy());
    });
    subtree.childAs(new sd.Text(svg, sd.rand(1, 5)), (parent, child) => {
        child.center(parent.cx(), parent.ky(0.7));
    });
}

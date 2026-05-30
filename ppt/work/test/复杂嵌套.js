import * as sd from "@/sd";

const svg = sd.svg();
sd.freeze();
const tree = makeTree();
sd.unfreeze();

sd.init(() => {});
sd.main(async () => {
    await sd.pause();
    tree.freeze().startAnimate().link(2, 4);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
    tree.unfreeze().endAnimate();
});

function makeComplexTree() {
    const tree = new sd.Tree(svg);
    tree.root(1, makeGrid());
    tree.newNode(2, makeArray());
    tree.newNode(3, makeGrid());
    tree.newNode(4, makeVertex());
    tree.newNode(5, makeGrid());
    tree.link(1, 2).link(1, 3).link(2, 4).link(3, 5);
}

function makeTree() {
    // return new sd.Tree(svg).root(1, makeGrid()).newNode(2, makeArray()).newNode(3, new sd.Text(svg, "TEXT")).link(1, 2).link(1, 3);
    // return new sd.Array(svg).push(makeGrid()).push(makeArray()).push(new sd.Text(svg, "TEXT"));
    return new sd.Tree(svg).root(1).link(1, 2).link(1, 3);
}

function makeVertex() {
    return new sd.Vertex(svg, makeGrid());
}

function makeGrid() {
    const grid = new sd.Grid(svg);
    grid.insert(0, 0, makeArray()).insert(0, 1, makeArray()).insert(0, 2, new sd.Circle(svg));
    grid.insert(1, 0, "hello").insert(1, 1, "world");
    return grid;
}

function makeArray() {
    return new sd.Array(svg).resize(3);
}

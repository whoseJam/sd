import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const grid = new sd.GridGraph(svg).n(2).m(7).width(560).cx(600).cy(300);

sd.init(init);
sd.main(main);

function init() {
    function math(math) {
        return new sd.Math(grid, math);
    }
    grid.at(0, 0).newNode(1, math("S_0"));
    grid.at(0, 1).newNode(2, math("S_1"));
    grid.at(0, 2).newNode(3, math("S_2"));
    grid.at(0, 3).newNode(4, math("S_3"));
    grid.at(0, 4).newNode(5, math("S_4"));
    grid.at(0, 5).newNode(6, math("S_5"));
    grid.at(0, 6).newNode(7, math("S_6"));
    grid.at(0, 7).newNode(8, math("S_7"));
    for (let i = 1; i <= 7; i++) {
        grid.newLink(i, i + 1);
        grid.element(i, i + 1).value(math(`M_${i}`), R.pointAtPathByRate(0.5, "cx", "my"));
        grid.element(i, i + 1).arrow();
    }
    for (let i = 1; i <= 8; i++) grid.element(i).rate(2);
}

async function createChain(l, r, dy) {
    function math(math) {
        return new sd.Math(svg, math);
    }
    const nodes = [];
    for (let i = l; i <= r; i++) {
        nodes.push(
            new sd.Vertex(svg)
                .value(math(`S_${i}`))
                .rate(2)
                .center(grid.element(i + 1).center())
        );
        if (i > l)
            sd.Link(nodes[i - l - 1], nodes[i - l])
                .arrow()
                .value(math(`M_${i}`), R.pointAtPathByRate(0.5, "cx", "my"));
    }
    await sd.pause();
    nodes.forEach(node => {
        node.startAnimate().dy(dy).endAnimate();
    });
    await sd.pause();
    sd.Link(grid.element(1), nodes[0]).stroke(C.red).strokeWidth(3).startAnimate().pointStoT().endAnimate().arrow();
}

async function main() {
    await createChain(2, 4, 60);
    await createChain(3, 6, 120);
}

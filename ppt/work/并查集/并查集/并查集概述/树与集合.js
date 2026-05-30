import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const elements = [1, 4, 5, 7];

const tree = new sd.Tree(svg).width(400).x(650).y(250);
const setElements = [];
const setBoundary = new sd.Rect(svg);
const setTitle = new sd.Text(svg, "Set");
const treeTitle = new sd.Text(svg, "Tree");

sd.init(() => {
    tree.root(4);
    tree.link(4, 1);
    tree.link(4, 5);
    tree.link(4, 7);

    for (let i = 0; i < elements.length; i++) {
        const elem = new sd.Vertex(svg, elements[i].toString())
            .cx(150 + i * 100)
            .cy(300)
            .color(C.white);
        setElements.push(elem);
    }

    const positions = setElements.map(e => e.cx());
    const minX = Math.min(...positions);
    const maxX = Math.max(...positions);

    setBoundary
        .width(maxX - minX + 80)
        .height(80)
        .cx((minX + maxX) / 2)
        .cy(300)
        .borderRadius(15)
        .fillOpacity(0)
        .stroke(C.gray)
        .strokeWidth(2)
        .strokeDashArray([5, 5]);

    setTitle.fontSize(28).center((minX + maxX) / 2, 200);

    treeTitle.fontSize(28).center(850, 200);
});

sd.main(async () => {});

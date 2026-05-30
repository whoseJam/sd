import * as sd from "@/sd";

const svg = sd.svg();
const n = 7;
const degree = [1, 3, 2, 3, 1, 1, 1];
const arr = new sd.ValueArray(svg).elementWidth(80);
const tree = new sd.Tree(svg).width(400);

sd.init(() => {
    degree.forEach((d, i) => {
        const vertex = new sd.Vertex(svg, i + 1);
        vertex.label = sd.Label(vertex, `$d=${d}$`, "tc", 10, 1);
        vertex.degree = d;
        vertex.i = i + 1;
        arr.push(vertex);
    });
    tree.cx(arr.cx());
    tree.y(arr.my() + 60);
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate()
        .sort((a, b) => -(a.degree - b.degree))
        .endAnimate();

    const free = [];
    function getElement() {
        while (free.length > 0) {
            if (free[0].degree === 0) free.shift();
            else return free[0];
        }
        return undefined;
    }
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        arr.startAnimate();
        const vertex = arr.dropFirstElement();
        arr.endAnimate();
        const parent = getElement();
        tree.startAnimate();
        tree.newNodeFromExistElement(vertex.i, vertex);
        if (parent) {
            parent.degree--;
            vertex.degree--;
            tree.newLink(tree.nodeId(parent), vertex.i);
        }
        tree.endAnimate();
        free.push(vertex);
    }
});

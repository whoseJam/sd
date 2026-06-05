import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).width(200).height(200).cx(600).cy(300);
const links = [
    { from: 1, to: 2, cap: "1/2", xloc: "cx", yloc: "my" },
    { from: 2, to: 3, cap: "1/2", xloc: "x", yloc: "my" },
    { from: 2, to: 4, cap: "1/2", xloc: "x", yloc: "y" },
    { from: 3, to: 1, cap: "1/2", xloc: "mx", yloc: "my" },
    { from: 4, to: 1, cap: "1/2", xloc: "mx", yloc: "y" },
];

sd.init(() => {
    graph.at(0.5, 0).newNode(1);
    graph.at(0.5, 1).newNode(2);
    graph.at(0, 0.5).newNode(3);
    graph.at(1, 0.5).newNode(4);
    function link(x, y) {
        graph.newLink(x, y);
    }
    links.forEach(lk => {
        link(lk.from, lk.to);
        const e = graph.element(lk.from, lk.to).arrow();
        e.value(new sd.Text(e, lk.cap).fontSize(20), R.pointAtPathByRate(0.5, lk.xloc, lk.yloc));
    });
});

sd.main(async () => {});

import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const data = [3, 6, 2, 5];
const graph = new sd.GridGraph(svg);
const f = sd.make1d(data.length);
const arr = new sd.Array(svg).pushArray(data);
let maxLength = 1;

sd.init(() => {
    arr.cy(graph.cy()).x(graph.mx() + 100);
    const k = 1 / (data.length - 1);
    graph.at(0, 0.5).newNode("S");
    graph.at(1, 0.5).newNode("T");
    for (let i = 0; i < data.length; i++) {
        f[i] = 1;
        for (let j = i - 1; j >= 0; j--) {
            if (data[j] <= data[i]) {
                f[i] = Math.max(f[i], f[j] + 1);
            }
        }
        graph.at(0.33, i * k).newNode(IN(i), i + 1);
        graph.at(0.66, i * k).newNode(OUT(i), i + 1);
        maxLength = Math.max(maxLength, f[i]);
    }
    for (let i = 0; i < data.length; i++) {
        if (f[i] === 1) graph.link("S", IN(i)).element("S", IN(i)).arrow();
        if (f[i] === maxLength) graph.link(OUT(i), "T").element(OUT(i), "T").arrow();
        graph.link(IN(i), OUT(i));
        graph.element(IN(i), OUT(i)).arrow().value(new sd.Math(svg, "1"), R.pointAtPathByRate(0.5, "mx", "cy", -3));
        for (let j = 0; j < i; j++) {
            if (f[j] + 1 === f[i] && data[j] <= data[i]) {
                graph.link(OUT(j), IN(i));
                graph.element(OUT(j), IN(i)).arrow().strokeDashArray([5, 5]);
                sd.Link(arr.element(j), arr.element(i), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).arrow();
            }
        }
    }
});

sd.main(async () => {});

function OUT(x) {
    return x;
}

function IN(x) {
    return x + data.length;
}

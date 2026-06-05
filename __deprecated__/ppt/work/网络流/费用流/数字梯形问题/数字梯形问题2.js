import * as sd from "@/sd";

const svg = sd.svg();
const n = 2;
const m = 3;
const graph = new sd.GridGraph(svg).height(400).width(600);
const grid = new sd.Grid(svg).x(graph.mx() + 40);

const data = [
    [3, 5, 2],
    [5, 2, 3, 1],
];
const In = sd.make2d(10, 10);
const Out = sd.make2d(10, 10);
let tot = 0;

sd.init(() => {
    const layerHeight = 1 / (2 * n + 1);
    const gap = 1 / (m + n - 2);
    const gap2 = gap / 2;
    graph.at(0, 0.5).newNode("S");
    graph.at(1, 0.5).newNode("T");
    function link(u, v) {
        graph.newLink(u, v);
        graph.element(u, v).arrow();
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m + i - 1; j++) {
            In[i][j] = ++tot;
            Out[i][j] = ++tot;
            graph.at((i * 2 - 1) * layerHeight, (n - i) * gap2 + gap * (j - 1)).newNode(In[i][j], " ");
            graph.at(i * 2 * layerHeight, (n - i) * gap2 + gap * (j - 1)).newNode(Out[i][j], " ");
        }
    }
    function exist(i, j) {
        return i <= n && j <= m + i - 1;
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m + i - 1; j++) {
            link(In[i][j], Out[i][j]);
            if (exist(i + 1, j)) link(Out[i][j], In[i + 1][j]);
            if (exist(i + 1, j + 1)) link(Out[i][j], In[i + 1][j + 1]);
            if (i === 1) link("S", In[i][j]);
            if (i === n) link(Out[i][j], "T");
            grid.insert(i - 1, j - 1, data[i - 1][j - 1]);
        }
    }
    grid.cy(graph.cy());
});

sd.main(async () => {
    await sd.pause();
    graph.startAnimate();
    function exist(i, j) {
        return i <= n && j <= m + i - 1;
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m + i - 1; j++) {
            graph.value(In[i][j], Out[i][j], `inf/${data[i - 1][j - 1]}`);
            if (exist(i + 1, j)) graph.value(Out[i][j], In[i + 1][j], "1/0");
            if (exist(i + 1, j + 1)) graph.value(Out[i][j], In[i + 1][j + 1], "1/0");
            if (i === 1) graph.value("S", In[i][j], "1/0");
            if (i === n) graph.value(Out[i][j], "T", "1/0");
        }
    }
    graph.endAnimate();
});

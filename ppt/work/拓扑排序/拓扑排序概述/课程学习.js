import * as sd from "@/sd";

const svg = sd.svg();
const courseMap = new sd.BoxDAG(svg); // type: Node
const nodes = [0, 1, 2, 3, 4, 5, 6, 7];
const nodesToText = ["高等数学", "程序设计", "离散数学", "数据结构", "编译技术", "操作系统", "普通物理", "数字电路"];
const links = [
    [0, 2],
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [7, 5],
    [0, 6],
    [6, 7],
];

sd.init(() => {
    for (let i = 0; i < nodes.length; i++) {
        courseMap.newNode(nodes[i], nodesToText[i]);
        const tmp = courseMap.elementWidth(30); // type: sd.BoxDAG
    }
    for (let i = 0; i < links.length; i++) {
        const x = links[i][0];
        const y = links[i][1];
        courseMap.newLink(x, y);
        courseMap.element(x, y).arrow();
    }
    courseMap.cx(600).cy(300).elementWidth(80);
});

sd.main(async () => {});

/**
 * sd.GridGraph 是一个图形组件，它由节点（nodes）和边（links）组成
 * 在 sd.GridGraph 中，节点的坐标需要人为指定，边的坐标是根据节点确定的
 * sd.GridGraph 的每一个节点都是 sd.Vertex，每一条边都是 sd.Line
 *
 * sd.GridGraph 的坐标系统是基于网格的，高被等分为 n 份，宽被等分为 m 份
 * 如果设置 sd.GridGraph 的 at 函数为 (x, y) 后，再放置节点，那么这个节点会被放在高 x 份，宽 y 份的位置
 */

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).x(100).y(100);

sd.init(() => {
    let eps = 0.2;
    // 设置 sd.GridGraph 所构成的矩形的空间划分方式
    graph.n(3).m(4);
    graph.at(2, 1).newNode(1);
    graph.at(1, 2 - eps).newNode(2);
    graph.at(3, 2 - eps).newNode(3);
    graph.at(1, 3 + eps).newNode(4);
    graph.at(3, 3 + eps).newNode(5);
    graph.at(2, 4).newNode(6);

    link(1, 2);
    link(1, 3);
    link(2, 4);
    link(3, 5);
    link(4, 6);
    link(5, 6);
    function link(x, y) {
        graph.newLink(x, y);
        // 让边变成有向边，末端显示箭头
        graph.element(x, y).arrow();
    }
});

sd.main(async () => {
    await sd.pause();
    // 设置 7 号节点的位置，同时连接 6 号节点与 7 号节点
    graph.startAnimate().at(1, 4).link(6, 7).endAnimate();
    await sd.pause();
    const v1 = new sd.Vertex(svg, "H").x(800).y(200);
    const v2 = new sd.Vertex(svg, "B").x(800).y(300);
    const l = new sd.Line(svg).source([900, 100]).target([950, 150]);
    await sd.pause();
    // 让 sd.GridGraph 新建一个节点和一条连边，同时这个节点是已存在于场景中的节点，节点会动画平移到图中
    graph.startAnimate().at(0, 0).newNodeFromExistElement(8, v1).link(1, 8).endAnimate();

    // 让 sd.GridGraph 新建一个节点和一条连边
    // 节点是已存在于场景中的节点，节点会动画平移到图中
    // 边是已存在于场景中的边，边会动画平移到图中
    graph.startAnimate().at(1, 0).newNodeFromExistElement(9, v2).newLinkFromExistElement(1, 9, l).endAnimate();

    await sd.pause();
    graph.startAnimate().color(1, C.blue).endAnimate();

    await sd.pause();
    graph.element(1, 2).startAnimate().fadeStoT().endAnimate().arrow(null);

    await sd.pause();
    graph.element(1, 2).startAnimate().pointStoT().endAnimate().arrow();

    await sd.pause();
    graph.startAnimate().opacity(0.5).endAnimate();

    await sd.pause();
    graph.startAnimate().opacity(1).endAnimate();
});

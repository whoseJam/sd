/**
 * 此文件演示如何使用 sd.DAG 组件进行一些操作
 *
 * sd.DAG 组件是一个采用有向无环图布局的图组件，这里的图并不一定真的是无环的，但在在组件内部对所有图都会按照 degre 提供的布局去做布局
 * sd.DAG 的每个节点默认是 sd.Vertex，每一条边默认是 sd.Line
 *
 * 你可以设置 degre 布局的 rankDir 和 align
 * rankDir 决定了节点的排列方向
 * align 决定了节点在当前行的对齐方式
 *
 */

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.DAG(svg).cx(800).cy(300);
const n = 9;
const m = 10;

const links = [
    ["V1", "V3"],
    ["V1", "V4"],
    ["V2", "V5"],
    ["V3", "V5"],
    ["V4", "V6"],
    ["V5", "V7"],
    ["V5", "V8"],
    ["V6", "V8"],
    ["V7", "V9"],
    ["V8", "V9"],
];

sd.init(() => {
    links.forEach(link => {
        // 使用 sd.DAG 的 link 方法添加边的时候，会自动创建节点
        graph.link(link[0], link[1]);
        // 获取对应的 link，然后设置为有向边（让边的末端显示箭头）
        graph.element(link[0], link[1]).arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    // 设置 sd.DAG 的 rankDir 属性为 RL，让节点从右到左排列
    graph.startAnimate().rankDir("RL").endAnimate();
    await sd.pause();
    // 设置 sd.DAG 的 align 属性为 DL，让节点在当前行的对齐方式为从下到上
    graph.startAnimate().align("DL").endAnimate();
});

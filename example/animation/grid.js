/**
 * 此文件演示如何使用 sd.Grid 组件进行一些操作
 *
 * sd.Grid 组件是一个可视化的网格组件，它内部每一个元素都是一个 sd.Box
 * 这些 sd.Box 形成一个二维数组的结构，拥有相同的宽度和高度
 * 二维数组的第二维度并不一定具有相同的长度，这使得可以用 sd.Grid 组件去描述类似倒三角的不规则网格
 *
 * 在 sd.Grid 的布局设置中，可以设置主轴 axis 是行还是列，可以设置对齐方式 align 是左对齐/右对齐/上对齐/下对齐/居中对齐
 * 如果主轴是行（row），则称为行优先布局，这种布局下，将先把二维数组的第一维按照行顺次排列下去，在一行内，可以设置左对齐/居中对齐/右对齐（x/cx/mx）
 * 如果主轴是列（col），则称为列优先布局，这种布局下，将先把二维数组的第二维按照列顺次排列下去，在一列内，可以设置上对齐/居中对齐/下对齐（y/cy/my）
 */

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).x(100).y(100);

sd.init(() => {
    // 让 sd.Grid 的行列下标都从 1 开始
    grid.startN(1).startM(1);

    // 设置一个 3x4 的网格
    grid.n(3).m(4);

    // 让 sd.Grid 下方呈现一个倒三角的姿态
    // 添加一行，该行有 3 个元素
    // 再添加一行，该行有 2 个元素
    // 再添加一行，该行有 1 个元素
    grid.pushPrimary(3).pushPrimary(2).pushPrimary(1);

    // 向 sd.Grid 的 (1, 1) 处插入数值
    grid.value(1, 1, 1);

    // 向 sd.Grid 的 (2, 1) 处插入字符串
    grid.value(2, 1, "str");

    // 向 sd.Grid 的 (3, 1) 处插入空
    grid.value(3, 1, null);

    // 向 sd.Grid 的 (1, 2) 处插入其他组件
    grid.value(1, 2, new sd.Circle(svg));
});

sd.main(async () => {
    await sd.pause();
    // 让 sd.Grid 在行优先布局下，每一行内居中对齐
    grid.startAnimate().align("cx").endAnimate();

    await sd.pause();
    grid.startAnimate();
    // 将 sd.Grid 的 (1, 3) 染为红色
    grid.color(1, 3, C.red);
    // 将 sd.Grid 的 (2, 2) 染为蓝色，此处先获取到 (2, 2) 对应的元素，再修改其颜色属性
    grid.element(2, 2).color(C.blue);
    grid.endAnimate();

    await sd.pause();
    // 删除 sd.Grid 的 (1, 1) 处的元素，同行的后续元素会向前移动一个单位
    grid.startAnimate().erase(1, 1).endAnimate();

    await sd.pause();
    // 调整 sd.Grid 的每一个 Box 的宽度和高度
    grid.startAnimate().elementWidth(50).elementHeight(60).endAnimate();
});

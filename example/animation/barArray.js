/**
 * 此文件演示如何使用 sd.BarArray 组件进行一些操作
 *
 * sd.BarArray 组件是一个可视化的数组组件，它内部每一个元素本质都是一个数值，为了表示数值的高度，使用 sd.Rect 来表示
 * 这些 sd.Rect 从左往右顺次排列，拥有相同的宽度，高度由当前元素的数值决定
 *
 */

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const array = new sd.BarArray(svg).x(100).y(400).start(1);
const data = [1, 2, 3, 2, 1];

sd.init(() => {
    array.pushArray(data);
});

sd.main(async () => {
    await sd.pause();
    array.startAnimate().sort().endAnimate();

    await sd.pause();
    array.startAnimate();
    const e5 = array.dropElement(5);
    const e3 = array.dropElement(3);
    array.insertFromExistElement(3, e5);
    array.insertFromExistElement(5, e3);
    array.endAnimate();

    await sd.pause();
    array.forEachElement((element, id) => {
        element.onClick(() => {
            sd.inter(async () => {
                element.startAnimate().color(C.red).endAnimate();
            });
        });
    });

    await sd.pause();
    array.startAnimate().color(3, C.blue).endAnimate();

    await sd.pause();
    array.startAnimate().erase(4).erase(2).endAnimate();

    await sd.pause();
    array.startAnimate().elementWidth(50).endAnimate();

    await sd.pause();
    array.startAnimate().elementHeight(50).endAnimate();
});

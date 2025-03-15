/**
 * 此文件演示如何使用 sd.Array 组件进行一些操作
 *
 * sd.Array 组件是一个可视化的数组组件，它内部每一个元素都是一个 sd.Box
 * 这些 sd.Box 从左往右顺次排列，拥有相同的宽度和高度
 *
 */
import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const arr = new sd.Array(svg).x(100).y(100);

sd.init(() => {
    // 让 sd.Array 从下标 1 开始
    arr.start(1);
    // 向 sd.Array 中添加数值
    for (let i = 1; i <= 5; i++) arr.push(6 - i);
    // 向 sd.Array 中添加字符串
    arr.push("str");
    // 向 sd.Array 中添加空
    arr.push(null);
    // 向 sd.Array 中添加其他组件
    arr.push(new sd.Circle(svg));
});

sd.main(async () => {
    await sd.pause();
    // 对某段区间进行排序
    // 排序使用的默认排序器，会让元素按照 intValue 从小到大排序
    arr.startAnimate().sort(1, 5).endAnimate();

    await sd.pause();
    // 交换某两个元素，容纳元素的框和元素的值都会被交换
    // 这里 dropElement 和 insertElement 的顺序值得注意
    // 如果先 drop 第 5 个元素，由于原本的第 6 个元素往前移动了一位，所以下一次 drop 还是应该指定为第 5 个元素；insert 同理
    // 建议在从 sd.Array 中 drop/erase 多个元素时，从后往前处理
    // 建议在向 sd.Array 中 insert 多个元素时，从前往后处理
    arr.startAnimate();
    const e6 = arr.dropElement(6);
    const e5 = arr.dropElement(5);
    arr.insertFromExistElement(5, e6);
    arr.insertFromExistElement(6, e5);
    arr.endAnimate();

    await sd.pause();
    // 仅交换两个元素的值
    arr.startAnimate();
    // 这种写法将 sd.Array 的第三个元素的内部值取出来
    const v3 = arr.dropValue(3);
    // 这种写法先选中 sd.Array 的第四个元素，在让它把自己的内部值取出来
    const v4 = arr.element(4).drop();
    // console.log(v4.delay(), v4.duration());
    // 这种写先选中 sd.Array 的第三个元素，再让它把 v4 作为自己的内部值，同时 v4 是场景中已经存在的，会动画平移到第三个元素内部
    arr.element(3).valueFromExist(v4);
    // 这种写法先选中 sd.Array 第四个元素，再让它把 v3 作为自己的内部值，同时指定 v3 在作为第四个元素的子节点时，是平移过去
    arr.element(4).value(v3.onEnter(EN.moveTo()));
    arr.endAnimate();

    await sd.pause();
    // 遍历 sd.Array 中的每一个元素
    arr.forEachElement((element, id) => {
        // 可以对 element 进行一些操作
        element.onClick(() => {
            // 如果在交互回调中有动画编排操作，一定要使用 sd.inter 包裹起来
            sd.inter(async () => {
                element.startAnimate().color(C.random()).endAnimate();
            });
        });
    });

    await sd.pause();
    // 删除 sd.Array 中的元素
    // 当要删除多个元素时，建议从后往前删除
    arr.startAnimate().erase(4).erase(2).endAnimate();

    await sd.pause();
    // 调整 sd.Array 每一个 Box 的宽度和高度
    arr.startAnimate().elementWidth(50).elementHeight(60).endAnimate();
});

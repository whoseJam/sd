/**
 * 此文件演示如何使用 sd.Box 组件进行一些操作
 *
 * sd.Box 组件继承自 sd.BaseElement 组件，它是一个容器，由 background 和 value 两个图层组成
 * background 即背景，在 sd.Box 组件中，background 是一个矩形 Rect
 * value 即容器内容，value 可以是任意的 SDNode
 *
 * sd.Box 组件在默认情况下会把 value 居中放置，在保证 value 的长宽比不变的情况下，适当调整 value 的大小
 * 可以使用空闲率控制 value 占据的空间
 * 空闲率越大，则 value 占据的空间越小
 * 空闲率越小，则 value 占据的空间越大
 * 空闲率默认情况下为 1.2
 */
import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const box = new sd.Box(svg).x(100).y(100);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    // value 可以是数值，在内部会被转化为 sd.Text 对象
    // 当 value 进入 sd.Box 时，默认情况下会从 sd.Box 中心浮现出来
    box.startAnimate().value(1).endAnimate();

    await sd.pause();
    // value 可以是字符串，在内部会被转化为 sd.Text 对象
    // 在设置新的 value 时，原来的 value 会被删除
    box.startAnimate().value("aaa").endAnimate();

    await sd.pause();
    // value 可以是一个任意的 SDNode
    // 在设置新的 value 时，原来的 value 会被删除
    box.startAnimate().value(new sd.Circle(svg)).endAnimate();

    await sd.pause();
    // 可以通过 value 方法直接访问 value
    box.value().startAnimate().color(C.red).endAnimate();

    await sd.pause();
    // 丢弃 value，value 不会从场景中消失，只是切断 value 和 sd.Box 的父子关系
    // 并且不再跟随 sd.Box 移动
    const circle = box.drop();
    box.startAnimate().x(200).endAnimate();

    await sd.pause();
    // 可以让 circle 重新作为 sd.Box 的 value
    // valueFromExist 把场景中已存在的对象作为 sd.Box 的 value
    // 当 value 在进入 sd.Box 的过程中，它会平移过去，而不是直接从 sd.Box 的中心浮现出来
    box.startAnimate().valueFromExist(circle).endAnimate();

    await sd.pause();
    box.drop();
    box.startAnimate().x(300).endAnimate();

    await sd.pause();
    // 这样写也能使 value 在进入 sd.Box 的过程中，平移过去
    box.startAnimate().value(circle.onEnter(EN.moveTo())).endAnimate();

    await sd.pause();
    box.startAnimate().value("123").endAnimate();
    console.log(box.intValue()); // 123
    console.log(box.text()); // "123"
    sd.checkEffect(box.value().rule());

    await sd.pause();
    box.text("hello");
    console.log(box.text()); // "hello"

    await sd.pause();
    box.text("");
    console.log(box.intValue()); // 0
    console.log(box.text()); // ""

    await sd.pause();
    box.value(null);
    console.log(box.intValue()); // 0
    console.log(box.text()); // ""
});

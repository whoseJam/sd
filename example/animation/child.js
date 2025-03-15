/**
 * 此文件演示如何正确理解 sd 动画框架中的父子关系
 */
import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter(); // 默认过渡动画为 appear
const EX = sd.exit(); // 默认过渡动画为 fade

/**
 * 如果两个节点是父子关系，则当父节点被 startAnimate 后，子节点会自动 startAnimate
 * 反之则不然
 */

sd.init(() => {});

sd.main(async () => {
    // 在 svg 画布上绘制两个矩形
    const r1 = new sd.Rect(svg);
    const r2 = new sd.Rect(svg);
    // 将 r2 作为 r1 的子节点，此时 r2 会自动移动到 r1 的图层内
    // 同时定义 r2 相对于 r1 的布局规则，保证 r2 的 x 坐标为 r1 的 mx 坐标，r2 的 y 坐标为 r1 的 y 坐标
    // sd.rule 模块中提供了一些预设的布局规则
    r1.childAs(r2, function (parent, child) {
        child.x(parent.mx()).y(parent.y());
    });
    await sd.pause();
    // 在存在布局规则的情况下，修改 r1 的坐标会自动触发 r2 的坐标更新
    r1.startAnimate().x(100).y(100).endAnimate();

    await sd.pause();
    // 在 svg 画布上再绘制一个矩形
    const r3 = new sd.Rect(svg);
    console.log(r3._.parent); // undefined（画布并不被认为是一个节点）

    await sd.pause();
    // 可以指定当把一个节点作为另一个子节点的过程中的过渡动画
    // 使用 r3.onEnter 指定当 r3 成为某节点的子节点时，应该如何过渡过去
    // 此处选择 moveTo，即从 r3 所在的位置移动过去
    r1.startAnimate();
    r1.childAs(r3.onEnter(EN.moveTo()), function (parent, child) {
        child.x(parent.x()).y(parent.my());
    });
    r1.endAnimate();
    console.log(r3._.parent); // r1

    await sd.pause();
    // 同样可以指定当把一个节点从另一个节点的子节点中移除时的过渡动画
    // 使用 r3.onExit 指定当 r3 被从子节点中移除出去时，应该如何过渡
    // 此处选择 fade，即 r3 将会从场景中消失
    r1.startAnimate().eraseChild(r3.onExit(EX.fade())).endAnimate();
    console.log(r3._.parent); // undefined

    await sd.pause();

    // 有一些组件提供了额外的添加了删除功能，例如 Array 组件
    // 向序列内添加元素（子节点）就可以通过 push/insert 实现
    // 删除序列上的元素（子节点）就可以通过 pop/erase 实现
    // 此时就不用使用 childAs/eraseChild 来实现子节点的添加删除了
    // 当然，如果是向 Array 添加不在其管理范围内的元素，还是得用 childAs/eraseChild
    const arr = new sd.Array(svg);
    // 添加的元素最初是被画在哪个图层上（svg/arr/r1...）不重要，它们一旦成为 arr 的子节点后，会自动移动到正确的图层上
    arr.push(1).push(new sd.Rect(svg)).push(new sd.Text(arr, "3"));
    await sd.pause();
    arr.startAnimate().erase(1).erase(0).endAnimate();
    await sd.pause();
    arr.startAnimate().childAs(new sd.Text(svg, "label"), R.aside("bc")).endAnimate();
});

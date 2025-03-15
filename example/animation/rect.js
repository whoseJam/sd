import * as sd from "@/sd";

const svg = sd.svg();

// C 是颜色模块，提供了各种各样的颜色
const C = sd.color();
const rect = new sd.Rect(svg);

sd.init(() => {
    rect.cx(600).cy(300);
});

sd.main(async () => {
    await sd.pause();
    // 可以通过 x, y 函数来设置元素坐标
    rect.startAnimate().x(100).y(100).endAnimate();
    console.log(`x = ${rect.x()} y = ${rect.y()}`);

    await sd.pause();
    // 可以通过 fill 来设置填充色
    rect.startAnimate().fill(C.blue).endAnimate();
    console.log(`fill = ${rect.fill()}`);

    await sd.pause();
    // 可以通过 stroke 来设置边线颜色
    rect.startAnimate().stroke(C.red).endAnimate();
    console.log(`stroke = ${rect.stroke()}`);

    await sd.pause();
    // 可以通过 strokeWidth 设置边线粗细
    console.log(`default strokeWidth = ${rect.strokeWidth()}`);
    rect.startAnimate().strokeWidth(3).endAnimate();
    console.log(`strokeWidth = ${rect.strokeWidth()}`);

    // 可以通过 opacity 设置透明度
    await sd.pause();
    rect.startAnimate().opacity(0.5).endAnimate();
    await sd.pause();
    rect.startAnimate().opacity(1).endAnimate();

    // strokeDashArray 和 strokeDashOffset 组合起来可以玩出一些花样
    await sd.pause();
    rect.startAnimate().strokeDashArray([5, 5]).endAnimate();
    await sd.pause();
    rect.startAnimate(2000).strokeDashOffset(100).endAnimate();

    await sd.pause();
    // 可以通过 width 和 height 设置宽高
    console.log(`default width = ${rect.width()}`);
    console.log(`default height = ${rect.height()}`);
    rect.startAnimate().width(200).height(100).endAnimate();
    console.log(`width = ${rect.width()}`);
    console.log(`height = ${rect.height()}`);
});

/**
 * 此文件演示如何使用 sd 动画框架的基础 svg 元素
 * 这些元素都应该使用 svg 画布进行绘制
 * 这个文件必须学习
 */

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const circle = new sd.Circle(svg).x(100).y(100);
const ellipse = new sd.Ellipse(svg).x(200).y(100);
const image = new sd.Image(svg).x(300).y(100).href("https://cdn.luogu.com.cn/upload/image_hosting/20ipdo37.png");
const line = new sd.Line(svg).x(400).y(100);
const rect = new sd.Rect(svg).x(500).y(100);
const text = new sd.Text(svg, "hello").x(600).y(100);
const objects = [circle, ellipse, image, line, rect, text];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    objects.forEach(object => {
        object.startAnimate().y(200).endAnimate();
    });
    await sd.pause();
    // svg 基础元素都拥有填充色（fill）和描边色（stroke）之分
    // 如果只想对其中一种进行设置，可以单独调用 fill/stroke，并使用颜色模块中提供的小写字母颜色
    // 如果想同时设置两者，可以调用 color，并使用颜色模块中提供的大写字母颜色
    // 使用 color 方法查询得到的颜色始终是一个打包颜色，同时包含了 fill 和 stroke 的信息
    // 使用 fill/stroke 方法查询得到的颜色是一个单一颜色
    rect.startAnimate().color(C.BLUE).endAnimate();
    circle.startAnimate().fill(C.blue).endAnimate();
    console.log(rect.color(), rect.fill(), rect.stroke());
    console.log(circle.color(), circle.fill(), circle.stroke());
    await sd.pause();
    objects.forEach(object => {
        object.startAnimate().opacity(0.5).endAnimate();
    });
    await sd.pause();
    // 使用 remove 从场景中彻底删去某个对象
    objects.forEach(object => {
        object.startAnimate().opacity(0).endAnimate().remove();
    });
});

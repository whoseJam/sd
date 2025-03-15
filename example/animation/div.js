/**
 * 此文件演示如何使用 sd 动画框架中的 html 元素
 * 这些元素都应该使用 div 画布进行绘制
 * 这个文件必须学习
 */
import * as sd from "@/sd";

const div = sd.div();

const button = new sd.Button(div).x(100).y(100);
const slider = new sd.Slider(div).x(200).y(100);
const input = new sd.Input(div).x(300).y(100);
const canvas = new sd.Canvas(div).x(400).y(100);
const objects = [button, slider, input, canvas];

sd.init(() => {
    button.onClick(() => console.log("button is clicked!"));
    slider.min(1).max(100);
    slider.onChange(value => {
        console.log(`slider value change to ${value}`);
    });
    input.onChange(text => {
        console.log(`input text change to ${text}`);
    });
});

sd.main(async () => {
    await sd.pause();
    objects.forEach(object => {
        object.startAnimate().y(200).endAnimate();
    });
});

/**
 * 此文件演示如何使用 sd.Canvas 绘制 3D 场景
 */
import * as sd from "@/sd";

const div = sd.div();
const canvas = new sd.Canvas(div);

sd.init(() => {
    canvas.three(); // 激活 3D 绘制功能
});

sd.main(async () => {
    const c1 = new sd.Cube(canvas);
    const c2 = new sd.Cube(canvas).x(1);
    const c3 = new sd.Cube(canvas).x(2);
    const l = new sd.Light(canvas);
    await sd.pause();
    c1.startAnimate().y(1).endAnimate();
    c3.startAnimate().y(-1).endAnimate();
    await sd.pause();
    canvas.startAnimate().x(100).y(100).endAnimate();
});

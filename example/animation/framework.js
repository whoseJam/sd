/**
 * 此文件演示如何使用 sd 动画框架
 * 这个文件必须学习
 */

import * as sd from "@/sd"; // 导入 sd 动画框架

const svg = sd.svg(); // 这是 svg 画布
const div = sd.div(); // 这是 html 画布

// 模块引入，注意在一个动画中并不是每个模块都需要被引入，按需引入即可
const C = sd.color(); // 这是颜色模块，当使用颜色模块时，请通过 C 对象来使用，使代码更加简洁
const D = sd.device(); // 这是输入设备模块，当使用设备模块时，请通过 D 对象来使用，使代码更加简洁
const EN = sd.enter(); // 这是进入动画模块，当使用进入动画模块时，请通过 EN 对象来使用，使代码更加简洁
const EX = sd.exit(); // 这是退出动画模块，当使用退出动画模块时，请通过 EX 对象来使用，使代码更加简洁
const R = sd.rule(); // 这是布局规则模块，当使用布局规则模块时，请通过 R 对象 来使用，使代码更加简洁

// 一些全局变量的定义
const n = 3;
const m = 5;
const grid = new sd.Grid(svg).n(n).m(m);

// 可以把初始化有关的代码放在 sd.init 里面，也可以选择放在 sd.init 调用之前
sd.init(() => {
    grid.x(100).y(100);
});

// 主要动画逻辑放在 sd.main 里面
sd.main(async () => {
    await sd.pause(); // 使用 sd.pause 暂停
    grid.startAnimate().x(200).endAnimate();
    await sd.pause(); // 使用 sd.pause 暂停
    grid.startAnimate().x(300).endAnimate();
    grid.startAnimate().y(200).endAnimate();
    await sd.pause(); // 使用 sd.pause 暂停
    grid.startAnimate().x(400).y(300).endAnimate();
});

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const three = sd.three();
const C = sd.color();
const rect = new sd.Rect(svg).center(100, 100);
const button = new sd.Button(div).center(200, 100).width(100);
const cube = new sd.Cube(three);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    cube.startAnimate().x(2).endAnimate();
    cube.startAnimate()
        .rx(Math.PI / 2)
        .endAnimate();
    cube.startAnimate().color(C.pureRed).endAnimate();
    rect.startAnimate().dx(100).endAnimate();
    rect.startAnimate().dy(100).endAnimate();
    rect.startAnimate().color(C.blue).endAnimate();
    button.startAnimate().dx(500).endAnimate();
    button.startAnimate().dy(100).endAnimate();
});

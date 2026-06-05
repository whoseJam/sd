import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [1, 2, -1, 5, 6];
const scale = 40;
const circles = [];

sd.init(() => {
    data.sort((a, b) => a - b);
    const line = new sd.Line(svg)
        .source(-3 * scale, 0)
        .target(8 * scale, 0)
        .arrow();
    sd.Label(line, "a", "bl");
    data.forEach(value => {
        circles.push(
            new sd.Circle(svg)
                .r(6)
                .center(value * scale, 0)
                .color(C.blue)
        );
    });
});

sd.main(async () => {
    console.log("wtf0");
    await sd.pause();
    const links = [];
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            links.push(sd.Link(circles[i], circles[j], sd.Curve).bending(0.5).startAnimate().pointStoT().endAnimate().arrow());
        }
    }
    await sd.pause();
    links.forEach((link, idx) => {
        link.after(idx * 300)
            .startAnimate()
            .strokeWidth(3)
            .color(C.red)
            .endAnimate();
        link.startAnimate().strokeWidth(1).color(C.black).endAnimate();
    });
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const x = new sd.Array(svg).x(200).y(100);
const xdata = "00011000";

for (let i = 0; i < xdata.length; i++) x.push(xdata[i]);
appendName("x", x);

sd.main(async () => {
    await sd.pause();
    const x1 = new sd.Array(svg).x(200).y(180);
    appendName("-x的原码", x1);
    const c1 = "10011000";
    for (let i = 0; i < c1.length; i++) x1.startAnimate().push(c1[i]).endAnimate();

    await sd.pause();
    const x2 = new sd.Array(svg).x(200).y(260);
    appendName("-x的反码", x2);
    const c2 = "11100111";
    for (let i = 0; i < c2.length; i++) x2.startAnimate().push(c2[i]).endAnimate();

    await sd.pause();
    const x3 = new sd.Array(svg).x(200).y(340);
    appendName("-x的补码", x3);
    const c3 = "11101000";
    for (let i = 0; i < c3.length; i++) x3.startAnimate().push(c3[i]).endAnimate();

    await sd.pause();
    x.startAnimate()
        .dy(80 * 4)
        .endAnimate();

    await sd.pause();
    x.startAnimate().color(C.blue).endAnimate();
    x3.startAnimate().color(C.blue).endAnimate();

    await sd.pause();
    const x4 = new sd.Array(svg).x(200).y(500);
    appendName("计算结果", x4);
    const c4 = "00001000";
    for (let i = 0; i < c4.length; i++) x4.startAnimate().push(c4[i]).endAnimate();
});

function appendName(name, arr) {
    const text = new sd.Text(svg, name).fontSize(25);
    arr.childAs(text, function (parent, child) {
        child.mx(parent.x() - 10).cy(parent.cy());
    });
    text.opacity(0).startAnimate().opacity(1).endAnimate();
}

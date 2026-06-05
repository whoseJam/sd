import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const root = new sd.Vertex(svg, "r");
const father = new sd.Vertex(svg, "f");
const dots = new sd.Text(svg, "...");
const x = new sd.Vertex(svg, "x");
const layerHeight = 60;
let xf;

sd.init(() => {
    dots.dx(-40).dy(60);
    father.dx(-80).dy(110);
    x.dx(-100).dy(180);
    sd.Link(dots, root).arrow();
    sd.Link(father, dots).arrow();
    xf = sd.Link(x, father).arrow();
});

sd.main(async () => {
    await sd.pause();
    sd.Focus(x).startAnimate().focus().endAnimate();
    await sd.pause();
    sd.Link(father, root, sd.Curve).startAnimate().pointStoT().value("$dis_f$", R.pointAtPathByRate(0.5, "x", "cy", 4)).endAnimate().arrow();
    await sd.pause();
    xf.startAnimate().value("$dis_x$", R.pointAtPathByRate(0.5, "mx", "cy", -4)).endAnimate();
    await sd.pause();
    sd.Link(x, root, sd.Curve).bending(0.5).startAnimate().pointStoT().value("$dis_f+dis_x$", R.pointAtPathByRate(0.5, "x", "cy", 4)).endAnimate().arrow();
});

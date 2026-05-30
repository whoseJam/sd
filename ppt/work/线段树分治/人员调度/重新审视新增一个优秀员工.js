import * as sd from "@/sd";

const svg = sd.svg();
const EN = sd.enter();
const C = sd.color();
const R = sd.rule();
const subtree = new sd.Triangle(svg).height(220).width(150);
const vertex = new sd.Vertex(svg, "u");
const c1 = new sd.Circle(svg).r(10);
const c2 = new sd.Circle(svg).r(10);
const f1 = new sd.Vertex(svg, "f");
const c3 = new sd.Circle(svg).r(10);
const c4 = new sd.Circle(svg).r(10);
const f2 = new sd.Vertex(svg, "1");
const stack = new sd.ValueStack(svg).elementHeight(60);
const count = [8, 6, 5, 4, 3, 2, 1];

sd.init(() => {
    stack.pushArray([f2, c4, c3, f1, c2, c1, vertex]);
    for (let i = 1; i < stack.length(); i++) sd.Link(stack.element(i - 1), stack.element(i));
    stack.forEachElement((v, i) => {
        v.childAs("arr", new sd.Array(svg).resize(count[i]).elementWidth(12).elementHeight(12), R.aside("rc"));
    });
    f1.childAs(subtree.onEnter(EN.nothing()), (parent, child) => {
        child.cx(parent.cx()).y(parent.cy());
    });
    const curve = new sd.Curve(svg).source(f1.center()).target(subtree.kx(0.2), vertex.cy()).arrow();
    sd.trim(curve, f1);
    curve.value("min", R.pointAtPathByRate(1, "cx", "y"));
});

sd.main(async () => {
    await sd.pause();
    [f1, c3, c4, f2].forEach(v => {
        array(v).startAnimate().opacity(array(v).end(), 0.2).endAnimate();
    });
    await sd.pause();
    [vertex, c1, c2].forEach(v => {
        array(v).startAnimate();
        array(v).push();
        array(v).lastElement().color(C.green);
        array(v).endAnimate();
    });
    [f1, c3, c4, f2].forEach(v => {
        const last = array(v).end();
        array(v).startAnimate().opacity(last, 1).color(last, C.green).endAnimate();
    });
});

function array(vertex) {
    return vertex.child("arr");
}

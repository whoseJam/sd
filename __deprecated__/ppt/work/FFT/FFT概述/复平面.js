import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const coord = new sd.Coord(svg).viewX(-5).viewWidth(10).viewY(-5).viewHeight(10);
const vec = new sd.Line(svg).arrow();

let A = 3;
let B = 2;

sd.init(() => {
    coord.width(200).height(200);
    vec.source(coord.center());
    vec.target(coord.globalAt(3, 2));
    coord.xAxis().childAs(new sd.Text(svg, "实轴"), R.pointAtPathByRate(1, "cx", "y", 0, 5));
    coord.yAxis().childAs(new sd.Text(svg, "虚轴"), R.pointAtPathByRate(1, "x", "cy", 10));
    vec.childAs("x-line", new sd.Line(svg).stroke(C.grey).strokeDashArray([5, 5]), function (parent, child) {
        child.source(coord.globalAt(A, 0));
        child.target(coord.globalAt(A, B));
    });
    vec.childAs("x-label", new sd.Math(svg, "a"), function (parent, child) {
        child.cx(coord.globalX(A));
        child.y(coord.globalY(0) + 5);
    });
    vec.childAs("y-line", new sd.Line(svg).stroke(C.grey).strokeDashArray([5, 5]), function (parent, child) {
        child.source(coord.globalAt(0, B));
        child.target(coord.globalAt(A, B));
    });
    vec.childAs("y-label", new sd.Math(svg, "b"), function (parent, child) {
        child.mx(coord.globalX(0) - 5);
        child.cy(coord.globalY(B));
    });
});

sd.main(async () => {});

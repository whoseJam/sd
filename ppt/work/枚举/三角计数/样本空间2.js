import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const stkA = new sd.ValueStack(svg).elementWidth(80).opacity(0);
const stkB = new sd.ValueStack(svg).elementWidth(80).opacity(0);
const func = box("2n-2").opacity(0);
const answer = box("答案").opacity(0);
const operator = new sd.Text(svg, "×");

const grid = new sd.Grid(svg).n(5).m(5).dx(-300);
const line = new sd.Line(svg).opacity(0).target(40, 0);
line.childAs("c1", new sd.Circle(line).color(C.black).r(3), R.pointAtPathByRate(0));
line.childAs("c2", new sd.Circle(line).color(C.black).r(3), R.pointAtPathByRate(1));
line.child("c1").opacity(0);
line.child("c2").opacity(0);

sd.init(() => {
    stkA.push(box("1")).push(box("2")).push(box("3")).push(new sd.Text(stkA, "...")).push(box("n"));
    stkB.push(box("(1,2)")).push(box("(1,3)")).push(box("(1,4)")).push(new sd.Text(stkB, "...")).push(box("(n-1,n)"));
    sd.Label(stkA.element(0), "y", "tc", 15, 0);
    sd.Label(stkB.element(0), "l,r", "tc", 15, 0);
    stkB.x(stkA.mx() + 40);
    func.x(stkB.mx() + 120).cy(stkA.cy());
    operator.center((stkA.mx() + stkB.x()) / 2, stkA.cy()).opacity(0);
    let texted = 0;
    stkB.forEachElement((element, i) => {
        if (element instanceof sd.Text) {
            texted = 1;
            return;
        }
        const i_ = i - texted;
        const link = sd.Link(element, func, sd.Line, "mx", "cy", "x", "y").arrow().freeze();
        link.y2(link.y2() + (i_ / (stkB.length() - 2)) * func.height());
    });
    answer.x(func.mx() + 100).cy(stkA.cy());
    sd.Link(func, answer).arrow();
    const focus = sd.Focus(svg).stroke(C.black).strokeWidth(1).gap(10).focus(stkA, stkB);
    sd.Label(focus, "样本空间", "tc");
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(grid, "y", "r").startAnimate().moveTo(3, 0).endAnimate();
    line.width(5 * 40 - 40)
        .x(grid.x() + 20)
        .cy(grid.element(3, 0).cy())
        .startAnimate()
        .opacity(1)
        .endAnimate();
    stkA.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    sd.Pointer(grid, "l", "t").startAnimate().moveTo(4, 1).endAnimate();
    sd.Pointer(grid, "r", "t").startAnimate().moveTo(4, 3).endAnimate();
    line.startAnimate();
    line.x(grid.element(4, 1).cx());
    line.width(3 * 40 - 40);
    line.child("c1").opacity(1);
    line.child("c2").opacity(1);
    line.endAnimate();
    stkB.startAnimate().opacity(1).endAnimate();
    operator.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    grid.startAnimate();
    colorColumn(1, C.yellow);
    colorColumn(3, C.yellow);
    grid.endAnimate();
    const circle = new sd.Circle(line).color(C.black).r(3).center(grid.element(1, 3).center()).opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Link(circle, line.child("c1")).startAnimate().pointStoT().endAnimate();
    sd.Link(circle, line.child("c2")).startAnimate().pointStoT().endAnimate();
    func.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    answer.startAnimate().opacity(1).endAnimate();
});

function colorColumn(c, color) {
    for (let i = 0; i < grid.n(); i++) grid.color(i, c, color);
}

function box(text) {
    return new sd.Box(svg, text).width(80).height(25);
}

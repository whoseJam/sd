import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const stkA = new sd.ValueStack(svg).elementWidth(80);
const stkB = new sd.ValueStack(svg).elementWidth(80);
const stkC = new sd.ValueStack(svg).elementWidth(80);
const func = new sd.Box(svg)
    .value(new sd.Math(svg, "$if\\enspace\\overline{abc}=a^3+b^3+c^3$").fontSize(18), R.center())
    .width(240)
    .height(40);
const answer = box("答案");

sd.init(() => {
    stkA.push(box("1")).push(box("2")).push(box("3")).push(new sd.Text(stkA, "...")).push(box("9"));
    stkB.push(box("0")).push(box("1")).push(box("2")).push(new sd.Text(stkB, "...")).push(box("9"));
    stkC.push(box("0")).push(box("1")).push(box("2")).push(new sd.Text(stkC, "...")).push(box("9"));
    sd.Label(stkA.element(0), "a", "tc", 15, 0);
    sd.Label(stkB.element(0), "b", "tc", 15, 0);
    sd.Label(stkC.element(0), "c", "tc", 15, 0);

    stkB.x(stkA.mx() + 40);
    stkC.x(stkB.mx() + 40);
    func.x(stkC.mx() + 120).cy(stkA.cy());
    new sd.Text(svg, "×").center((stkA.mx() + stkB.x()) / 2, stkA.cy());
    new sd.Text(svg, "×").center((stkB.mx() + stkC.x()) / 2, stkA.cy());

    let texted = 0;
    stkC.forEachElement((element, i) => {
        if (element instanceof sd.Text) {
            texted = 1;
            return;
        }
        const i_ = i - texted;
        const link = sd.Link(element, func, sd.Line, "mx", "cy", "x", "y").arrow().freeze();
        link.y2(link.y2() + (i_ / (stkC.length() - 2)) * func.height());
    });
    answer.x(func.mx() + 100).cy(stkA.cy());
    sd.Link(func, answer).arrow();
    const focus = sd.Focus(svg).stroke(C.black).strokeWidth(1).gap(10).focus(stkA, stkC);
    sd.Label(focus, "样本空间", "tc");
});

sd.main(async () => {});

function box(text) {
    return new sd.Box(svg, text).width(80).height(25);
}

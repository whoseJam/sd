import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const stk = new sd.ValueStack(svg).elementWidth(80);
const func = new sd.Box(svg)
    .value(new sd.Math(svg, "$if\\enspace\\overline{abc}=a^3+b^3+c^3$").fontSize(18), R.center())
    .width(240)
    .height(40);
const answer = box("答案");

sd.init(() => {
    stk.push(box("100"));
    stk.push(box("101"));
    stk.push(box("102"));
    stk.push(box("103"));
    stk.push(new sd.Text(stk, "..."));
    stk.push(box("999"));
    func.x(stk.mx() + 120).cy(stk.cy());

    let texted = 0;
    stk.forEachElement((element, i) => {
        if (element instanceof sd.Text) {
            texted = 1;
            return;
        }
        const i_ = i - texted;
        const link = sd.Link(element, func, sd.Line, "mx", "cy", "x", "y").arrow().freeze();
        link.y2(link.y2() + (i_ / (stk.length() - 2)) * func.height());
    });
    answer.x(func.mx() + 100).cy(stk.cy());
    sd.Link(func, answer).arrow();
    const focus = sd.Focus(stk).stroke(C.black).strokeWidth(1).gap(10).focus();
    sd.Label(focus, "样本空间", "tc");
});

sd.main(async () => {});

function box(text) {
    return new sd.Box(stk, text).width(80).height(25);
}

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const stk = new sd.ValueStack(svg).elementWidth(80);
const func = box("计算过程");
const answer = box("答案");

sd.init(() => {
    stk.push(box("样本1"));
    stk.push(box("样本2"));
    stk.push(box("样本3"));
    stk.push(new sd.Text(stk, "..."));
    stk.push(box("样本n"));
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

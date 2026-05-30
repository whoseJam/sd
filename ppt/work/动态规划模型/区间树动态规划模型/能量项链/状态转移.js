import * as sd from "@/sd";

const svg = sd.svg();
const R_ = sd.rule();
const EN = sd.enter();
const n = 10;
const arr = new sd.Array(svg).resize(n).start(1);
const root = new sd.Rect(svg);
const L = new sd.Rect(svg);
const R = new sd.Rect(svg);
const K = 5;
const LLink = sd.Link(root, L, sd.Line, "cx", "my", "cx", "y").arrow();
const RLink = sd.Link(root, R, sd.Line, "cx", "my", "cx", "y").arrow();

sd.init(() => {
    sd.Pointer(arr, "l").moveTo(arr.start());
    sd.Pointer(arr, "r").moveTo(arr.end());
    root.width(n * 40 - 10)
        .height(10)
        .cx(arr.cx())
        .y(arr.my() + 10);
    L.width(K * 40 - 10)
        .height(10)
        .cx((arr.element(1).cx() + arr.element(K).cx()) / 2)
        .y(root.my() + 20)
        .opacity(0);
    R.width((n - K) * 40 - 10)
        .height(10)
        .cx((arr.element(K + 1).cx() + arr.element(n).cx()) / 2)
        .y(root.my() + 20)
        .opacity(0);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "k").startAnimate().moveTo(K).endAnimate();
    await sd.pause();
    const LRect = new sd.Rect(L).height(100);
    const RRect = new sd.Rect(R).height(100);
    LRect.childAs(new sd.Text(LRect, "?").onEnter(EN.appear()), R_.centerOnly());
    RRect.childAs(new sd.Text(RRect, "?").onEnter(EN.appear()), R_.centerOnly());
    L.childAs(LRect.onEnter(EN.appear()), (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    })
        .startAnimate()
        .opacity(1)
        .endAnimate();
    R.childAs(RRect.onEnter(EN.appear()), (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    })
        .startAnimate()
        .opacity(1)
        .endAnimate();
    await sd.pause();
    new sd.Math(svg, "h_l")
        .fontSize(15)
        .x(arr.element(1).x() - 3)
        .my(arr.y() - 3)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    new sd.Math(svg, "t_k")
        .fontSize(15)
        .mx(arr.element(K).mx() + 3)
        .my(arr.y() - 3)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    new sd.Math(svg, "t_r")
        .fontSize(15)
        .mx(arr.element(n).mx() + 3)
        .my(arr.y() - 3)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
});

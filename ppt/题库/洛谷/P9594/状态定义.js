import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const stk = new sd.ValueStack(svg).align("x").elementHeight(50);
const colorList = [C.red, C.green, C.blue, C.orange];

sd.init(() => {
    stk.push(new sd.Array(svg).resize(10).start(1));
    for (let i = 1; i < colorList.length; i++) {
        stk.push(new sd.Array(svg).resize(10).start(1));
    }
    for (let i = 0; i < colorList.length; i++) {
        sd.Aside(stk.element(i), new sd.Rect(svg).color(colorList[i]).width(20).height(20));
    }
    sd.Index(stk.element(0), "t");
})

sd.main(async () => {

})
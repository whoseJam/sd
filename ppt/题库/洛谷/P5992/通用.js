import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const img = new sd.Image(svg).width(600).height(400).href("./多个分段函数.png");
const line = new sd.Line(svg).source(0, 0).target(0, 400).stroke(C.red).strokeWidth(4);

line.drag((dx, dy) => {
    return [dx, 0];
});

sd.init(() => {

})

sd.main(async () => {

})
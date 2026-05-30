import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const l = 3;
const r = 9;
const mid = 6;
const s1 = new sd.Array(svg).resize(n).start(1);
const s2 = new sd.Array(svg).resize(n).dy(80).start(1);

sd.init(() => {
    s1.color(l, C.grey);
    s1.color(mid, C.red);
    s2.color(mid, C.red);
    s2.color(r, C.grey);
    sd.Link(s1.element(mid), s2.element(mid)).doubleArrow();
})

sd.main(async () => {

})
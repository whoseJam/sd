import * as sd from "@/sd";

const svg = sd.svg();
const A = 5;
const B = 8;
const D = 6
const arr = new sd.Array(svg).resize(A + B).start(1);
const arrA = new sd.Array(svg).resize(A).start(1);
const arrB = new sd.Array(svg).resize(B).start(1);
const p = sd.Pointer(arr, "l", "b", 5, 30, 5);

sd.init(() => {
    sd.Label(arrA, "A", "lc");
    sd.Label(arrB, "B", "lc");
    arrA.y(80);
    arrB.y(140).x(arr.element(A + 1).x());
    p.moveTo(A);
})

sd.main(async () => {
    for (let i = 1; i <= D; i++) {
        await sd.pause();
        p.startAnimate().moveTo(A + i).endAnimate();
        arrA.startAnimate().push().endAnimate();
        arrB.startAnimate().erase(1).dx(40).endAnimate();
    }
})
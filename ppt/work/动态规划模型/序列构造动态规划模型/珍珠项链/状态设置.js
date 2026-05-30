import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).start(1);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arr.push(new sd.Circle(svg).color(C.grey));
    }
})

sd.main(async () => {
    await sd.pause();
    const p = sd.Pointer(arr, "i", "b", 3, 20);
    p.startAnimate().moveTo(n).endAnimate();
    const b = sd.Brace(arr);
    b.startAnimate().brace(1, n, "b", 3).value("使用过j种珍珠").endAnimate();
    
    await sd.pause();
    const p1 = sd.Pointer(arr, "i+1", "b", 3, 20);
    const circle = new sd.Circle(svg);
    arr.startAnimate()
    arr.push();
    arr.lastElement().value(circle);
    p1.moveTo(n + 1);
    arr.endAnimate();
    await sd.pause();
    circle.startAnimate().color(C.grey).endAnimate();
    await sd.pause();
    circle.startAnimate().color(C.blue).endAnimate();
})
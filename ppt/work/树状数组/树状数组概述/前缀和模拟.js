import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).start(1);
const sum = new sd.Array(svg).dx(-40).y(60);
const data = [2, 1, 3, 2, 1, 4, 3, 2];
const brace = sd.Brace(arr);
const braceF = sd.Brace(sum);
const braceB = sd.Brace(sum);

sd.init(() => {
    sd.Label(arr, "A数组", "lc");
    sd.Label(sum, "前缀和", "lc");
    arr.pushArray(data);
    sum.push(0);
    for (let i = 0, s = 0; i < data.length; i++) {
        sum.push(s = s + data[i]);
    }
})

sd.main(async () => {
    await Query(2, 6);
    await Add(4, 2);
})

async function Add(x, d) {
    await sd.pause();
    const element = arr.element(x);
    const text = new sd.Text(element, `+${d}`).cx(element.cx()).my(element.y());
    element.startAnimate().color(C.orange).endAnimate();
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    text.startAnimate().cy(element.cy()).opacity(0).endAnimate().remove();
    element.startAnimate().value(element.intValue() + d).endAnimate();
    await sd.pause();
    const allBraces = [];
    for (let i = x, k = 1; i <= data.length; i++, k++) {
        const b = sd.Brace(sum);
        b.brace(0, i, "b", k * 10).startAnimate().pointTtoS().endAnimate();
        allBraces.push(b);
    }
    await sd.pause();
    sum.startAnimate();
    for (let i = x; i <= data.length; i++) {
        sum.value(i, sum.intValue(i) + d);
    }
    sum.endAnimate();
    await sd.pause();
    element.startAnimate().color(C.white).endAnimate();
    allBraces.forEach(b => b.startAnimate().opacity(0).remove());
}

async function Query(l, r) {
    await sd.pause();
    brace.startAnimate().brace(l, r, "t").endAnimate();
    arr.startAnimate().color(l, r, C.orange).endAnimate();
    await sd.pause();
    braceF.brace(0, l - 1, "b", 10).startAnimate().pointTtoS().endAnimate();
    braceB.brace(0, r, "b", 20).startAnimate().pointTtoS().endAnimate();
    let sum = 0;
    for (let i = l; i <= r; i++) sum += arr.intValue(i);
    await sd.pause();
    brace.startAnimate().value(sum).endAnimate();
    await sd.pause();
    brace.startAnimate().opacity(0).endAnimate();
    braceF.startAnimate().opacity(0).endAnimate();
    braceB.startAnimate().opacity(0).endAnimate();
    arr.startAnimate().color(C.white).endAnimate();
}
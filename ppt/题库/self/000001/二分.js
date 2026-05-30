import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data2 = [1, 0, 1, 3, 3, 4, 1, 0, 2, 2];
const data5 = [2, 1, 0, 3, 1, 2, 1, 1, 0, 1];
const cnt2 = new sd.Array(svg).start(1);
const cnt5 = new sd.Array(svg).start(1);

let interacting = false;

sd.init(() => {
    cnt5.y(cnt2.my() + 40);
    data2.forEach(d => cnt2.push(d));
    data5.forEach(d => cnt5.push(d));
    sd.Index(cnt2, "t");
    sd.Label(cnt2, "因子2的个数");
    sd.Label(cnt5, "因子5的个数");
    for (let i = 1; i <= cnt5.length(); i++) {
        cnt5.element(i).onClick(() => {
            if (interacting) return;
            interacting = true;
            color(i);
        })
    }
})

sd.main(async () => {

})

async function color(index) {
    for (let i = index; i <= cnt5.length(); i++) {
        await sd.pause();
        cnt2.startAnimate().color(i, C.grey).endAnimate();
        cnt5.startAnimate().color(i, C.grey).endAnimate();
    }
    await sd.pause();
    cnt2.startAnimate().color(C.white).endAnimate();
    cnt5.startAnimate().color(C.white).endAnimate();
    interacting = false;
}
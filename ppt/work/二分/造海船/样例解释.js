import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const L = [5, 4, 7];
const arrs = [];
for (let i = 0; i < L.length; i++) {
    arrs.push(new sd.Array(svg).resize(L[i]));
    arrs[i].y(60 + i * 60);
}

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    await update(3);
});

async function update(value) {
    let ans = 0;
    for (let i = 0; i < L.length; i++) {
        arrs[i].startAnimate();
        arrs[i].color(C.white);
        ans += Math.floor(L[i] / value);
        for (let j = 0; (j + 1) * value <= arrs[i].length(); j++) {
            for (let k = j * value; k < (j + 1) * value; k++) {
                if (j & 1) arrs[i].color(k, C.blue);
                else arrs[i].color(k, C.deepSkyBlue);
            }
        }
        arrs[i].endAnimate();
    }
}

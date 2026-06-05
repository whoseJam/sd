import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.BarArray(svg);
const data = [3, 2, 5, 4, 3];

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        arr.push(data[i]);
        arr.element(i).childAs(new sd.Math(svg, `a_${i + 1}`), R.aside("bc"));
    }
});

sd.main(async () => {});

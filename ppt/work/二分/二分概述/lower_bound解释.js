import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const x = 5;
const data1 = [1, 2, 3, 3, 5, 5, 5, 6, 6, 7];
const data2 = [1, 2, 2, 3, 4, 4, 7, 8, 9, 9];
const text = new sd.Text(svg, `x=${x}`);
const arr1 = new sd.Array(svg).pushArray(data1);
const arr2 = new sd.Array(svg).pushArray(data2);

sd.init(() => {
    arr1.cx(text.cx()).y(text.my() + 20);
    arr2.cx(text.cx()).y(arr1.my() + 20);
});

sd.main(async () => {
    await sd.pause();
    arr1.startAnimate().color(find(data1), C.red).endAnimate();
    await sd.pause();
    arr2.startAnimate().color(find(data2), C.red).endAnimate();
});

function find(data) {
    for (let i = 0; i < data.length; i++) if (data[i] >= x) return i;
    return -1;
}

import * as sd from "@/sd";

const svg = sd.svg();
const arr1 = new sd.Array(svg).pushArray([0, 0, 1, 0, 0]);
const arr2 = new sd.Array(svg).pushArray([1, 0, 0, 0, 0]).y(60);

const arr3 = new sd.Array(svg).pushArray([1, 2, 1, 3, 4]).x(300);
const arr4 = new sd.Array(svg).pushArray([1, 2, 1, 3, 4]).x(300).y(60);

sd.init(() => {
    sd.Label(arr1, "稀疏序列加法", "tc");
    sd.Label(arr3, "稠密序列加法", "tc");
    new sd.Text(svg, "+").cy((arr1.my() + arr2.y()) / 2).mx(arr1.x() - 20);
    new sd.Text(svg, "+").cy((arr3.my() + arr4.y()) / 2).mx(arr3.x() - 20);
});

sd.main(async () => {});

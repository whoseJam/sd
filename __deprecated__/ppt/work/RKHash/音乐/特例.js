import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).pushArray("CBCCA");
const arr1 = new sd.Array(svg)
    .pushArray("CBCC")
    .mx(arr.cx() - 20)
    .y(arr.my() + 20);
const arr2 = new sd.Array(svg)
    .pushArray("BCCA")
    .x(arr.cx() + 20)
    .y(arr.my() + 20);
const d1 = [1, 0, 1, 1];
const d2 = [1, 2, 2, 0];

sd.init(() => {
    arr1.forEachElement((element, index) => {
        sd.Label(element, d1[index], "bc", 15, 1);
    });
    arr2.forEachElement((element, index) => {
        sd.Label(element, d2[index], "bc", 15, 1);
    });
    sd.Link(arr1, arr2).arrow();
});

sd.main(async () => {});

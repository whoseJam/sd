import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const s1 = "111111111";
const s2 = "111010010";
const m1 = "111011011";
const m2 = "101111101";
const n = s1.length;
const arr1 = new sd.Array(svg).pushArray(s1);
const arr2 = new sd.Array(svg).pushArray(s2);

sd.init(() => {
    function Prepare(arr, mask) {
        for (let i = 0; i < n; i++) {
            if (mask[i] === "0") arr.color(i, C.grey);
            if (mask[i] === "1" && i + 1 < n && mask[i + 1] === "1") {
                let idx = i;
                arr.element(i).onClick(() => {
                    sd.inter(async () => { SwapValue(arr, idx, idx + 1); })
                });
            } else if (mask[i] === "1" && i - 1 >= 0 && mask[i - 1] === "1" && (i === n - 1 || mask[i + 1] === "0")) {
                let idx = i;
                arr.element(i).onClick(() => {
                    sd.inter(async () => { SwapValue(arr, idx, idx - 1); })
                });
            }
        }
    }
    arr2.dy(80);
    Prepare(arr1, m1); sd.Label(arr1, "s1");
    Prepare(arr2, m2); sd.Label(arr2, "s2");
})

sd.main(async () => {

})

function SwapValue(arr, a, b) {
    const A = arr.element(a).drop();
    const B = arr.element(b).drop();
    arr.element(a).startAnimate().valueFromExist(B).endAnimate();
    arr.element(b).startAnimate().valueFromExist(A).endAnimate();
}
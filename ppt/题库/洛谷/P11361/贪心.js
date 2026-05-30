import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const s1 = "011011101";
const s2 = "111010010";
const m1 = "110111011";
const m2 = "111101110";
const n = s1.length;
const arr1 = new sd.Array(svg).pushArray(s1);
const arr2 = new sd.Array(svg).pushArray(s2);

sd.init(() => {
    arr2.dy(100);
    sd.Label(arr1, "s1");
    sd.Label(arr2, "s2");
    for (let i = 0; i < n; i++) {
        if (m1[i] === "0") arr1.color(i, C.grey);
        if (m2[i] === "0") arr2.color(i, C.grey);
    }
})

sd.main(async () => {
    await sd.pause();
    await Split(s1, m1, arr1);
    await sd.pause();
    await Split(s2, m2, arr2);
    await sd.pause();
    await TakeOut(arr1, 1);
    await TakeOut(arr2, 1);
    
    for (let i = 0; i < n; i++) {
        await sd.pause();
        const bel1 = arr1.element(i).belong;
        const bel2 = arr2.element(i).belong;
        if (arr1.element(bel1).cnt0.length > 0 && arr2.element(bel2).cnt0.length > 0) {
            arr1.element(i).startAnimate().valueFromExist(arr1.element(bel1).cnt0[0]).endAnimate();
            arr2.element(i).startAnimate().valueFromExist(arr2.element(bel2).cnt0[0]).endAnimate();
            arr1.element(bel1).cnt0.shift();
            arr2.element(bel2).cnt0.shift();
        } else if (arr1.element(bel1).cnt1.length > 0 && arr2.element(bel2).cnt1.length > 0) {
            arr1.element(i).startAnimate().valueFromExist(arr1.element(bel1).cnt1[0]).endAnimate();
            arr2.element(i).startAnimate().valueFromExist(arr2.element(bel2).cnt1[0]).endAnimate();
            arr1.element(bel1).cnt1.shift();
            arr2.element(bel2).cnt1.shift();
        } else {
            arr1.element(i).startAnimate().value(new sd.Circle(svg).color(C.red)).endAnimate();
            arr2.element(i).startAnimate().value(new sd.Circle(svg).color(C.red)).endAnimate();
        }
    }
})

async function TakeOut(arr, flg) {
    for (let i = 0; i < n; i++) {
        const value = arr.element(i).drop();
        const belong = arr.element(i).belong;
        value.startAnimate().dy(flg * 40);
        if (value.intValue() === 1) arr.element(belong).cnt0.push(value);
        else arr.element(belong).cnt1.push(value);
    }
}

async function Split(s, m, arr) {
    for (let l = 0, r; l < n; l = r + 1) {
        r = l;
        if (m[l] == "1") {
            while (r + 1 < n && m[r + 1] == "1") r++;
        }
        sd.Brace(arr).startAnimate().brace(l, r).endAnimate();
        for (let i = l; i <= r; i++) {
            arr.element(i).belong = l;
        }
        arr.element(l).cnt0 = [];
        arr.element(l).cnt1 = [];
    }
}

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).x(100).y(100);
const pairArray = {};
const data = [
    C.red, C.red, C.green, C.green, C.blue, C.green, C.green
];

sd.init(() => {
    arr.resize(data.length);
    data.forEach((col, idx) => {
        arr.color(idx, col);
    });
    const cols = [...new Set(data)];
    for (let i = 0; i < cols.length; i++) {
        const pair = new sd.Array(svg).x(100).y(180 + i * 80);
        for (let l = 0, r; l < data.length; l = r + 1) {
            r = l;
            while (r + 1 < data.length && data[r + 1] === data[l]) r++;
            if (data[l] !== cols[i]) continue;
            for (let i = l; i <= r; i++) pair.push(i + 1);
        }
        pair.childAs("label", new sd.Rect(pair).color(cols[i]).width(20).height(20), R.aside("lc", 10));
        pairArray[cols[i]] = pair;
    }
})

sd.main(async () => {
    await insertInto(C.blue, C.green);
    await insertInto(C.red, C.green);
})

async function insertInto(fromCol, toCol) {
    await sd.pause();
    arr.startAnimate();
    for (let i = 0; i < arr.length(); i++) {
        if (arr.color(i).main === fromCol) arr.color(i, toCol);
    }
    arr.endAnimate();
    await sd.pause();
    const fromArray = pairArray[fromCol];
    const toArray = pairArray[toCol];
    toArray.startAnimate();
    fromArray.freeze();
    for (let i = fromArray.length() - 1; i >= 0; i--) {
        const e = fromArray.dropElement(0);
        toArray.pushFromExistElement(e);
    }
    fromArray.unfreeze();
    toArray.endAnimate();
}
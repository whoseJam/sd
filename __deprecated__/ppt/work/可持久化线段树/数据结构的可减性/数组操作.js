import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const oldData = [3, 4, 2, 1, 3, 2];
const modifyData = [0, 0, 3, 3, 3, 0];
const arr = new sd.Array(svg);
const modify = new sd.Array(svg);
const newArr = new sd.Array(svg);
sd.Label(arr, "S", "lc");
sd.Label(modify, "Modify", "lc");
sd.Label(newArr, "S'", "lc");

sd.init(init);
sd.main(main);

function init() {
    arr.pushArray(oldData).x(100).y(100);
    modify.pushArray(modifyData).x(100).y(180);
    newArr.x(100).y(260);
}

async function main() {
    await sd.pause();
    for (let i = 0; i < oldData.length; i++) {
        newArr.startAnimate().push(oldData[i] + modifyData[i]).endAnimate();
    }
}
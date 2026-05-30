import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const oldData = [3, 4, 2, 1, 3, 2];
const modifyData = [0, 0, 3, 3, 3, 0];
const arr = new sd.Array(svg);
const modify = new sd.Array(svg);
const newArr = new sd.Array(svg);
const rect = new sd.Rect(svg);
sd.Label(arr, "S", "lc");
sd.Label(modify, "Modify", "lc");
sd.Label(newArr, "S'", "lc");

sd.init(init);
sd.main(main);

function init() {
    arr.pushArray(oldData).x(100).y(100);
    modify.pushArray(modifyData).x(100).y(180);
    for (let i = 0; i < oldData.length; i++) {
        newArr.push(oldData[i] + modifyData[i]);
    }
    newArr.x(100).y(260);
    rect.x(95).width(arr.width() + 10);
    rect.y(95).height(arr.height() + 10);
    rect.color(C.GREY);
    rect.dy(-80);
}

async function main() {
    await sd.pause();
    rect.startAnimate().dy(80).endAnimate();
    await sd.pause();
    rect.startAnimate().dy(80).endAnimate();
    await sd.pause();
    rect.startAnimate().dy(80).endAnimate();
    await sd.pause();
    rect.startAnimate().opacity(0).endAnimate();
}
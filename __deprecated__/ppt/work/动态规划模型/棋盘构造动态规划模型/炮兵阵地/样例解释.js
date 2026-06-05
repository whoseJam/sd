import * as sd from "@/sd";
import { interactableGrid } from "../_/InteractableGrid";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const m = 5;
const grid = interactableGrid(n, m, {
    onChangeStatus,
    totalStatus: 2,
});

sd.init(() => {
    grid.forEachElement(element => {
        const x = sd.rand(0, 100) <= 50 ? C.green : C.grey;
        element.color(x);
    });
});

sd.main(async () => {});

async function onChangeStatus(element, i, j, status) {
    element.startAnimate();
    if (status === 0) element.value(null);
    else element.value(new sd.Image(svg).href("https://img.88icon.com/download/jpg/202006/556fbdae3b7987691dacc054400fe9dc_512_512.jpg!bg"));
    element.endAnimate();
    return true;
}

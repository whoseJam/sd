import * as sd from "@/sd";
import { interactableGrid } from "../_/InteractableGrid";

const svg = sd.svg();
const C = sd.color();
const n = 2;
const m = 8;
const math1 = new sd.Math(svg, "0".repeat(m));
const math2 = new sd.Math(svg, "0".repeat(m));
const grid = interactableGrid(n, m, {
    onChangeStatus,
    totalStatus: 2,
});

sd.init(() => {
    math1.cx(grid.cx()).y(grid.my() + 10);
    math2.cx(grid.cx()).y(math1.my() + 10);
    grid.forEachElement(element => {
        const x = sd.rand(0, 100) <= 50 ? C.green : C.grey;
        element.color(x);
    });
    sd.Pointer(grid, "i", "r", 3, 20).moveTo(1, 1);
    sd.Pointer(grid, "i+1", "r", 3, 20).moveTo(2, 1);
});

sd.main(async () => {});

async function onChangeStatus(element, i, j, status) {
    element.startAnimate();
    if (status === 0) element.value(null);
    else element.value(new sd.Image(svg).href("https://img.88icon.com/download/jpg/202006/556fbdae3b7987691dacc054400fe9dc_512_512.jpg!bg"));
    element.endAnimate();
    const math = i === 1 ? math1 : math2;
    let ans = math.math().split("");
    ans[j - 1] = String(status);
    math.startAnimate().transformMath(ans.join("")).endAnimate();
    return true;
}

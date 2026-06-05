import * as sd from "@/sd";
import { interactableGrid } from "../_/InteractableGrid";

const svg = sd.svg();
const n = 2;
const m = 5;
const math1 = new sd.Math(svg, "0".repeat(m));
const math2 = new sd.Math(svg, "0".repeat(m));
const grid = interactableGrid(n, m, {
    onChangeStatus,
    totalStatus: 2,
});

sd.init(() => {
    math1.cx(grid.cx()).y(grid.my() + 10);
    math2.cx(grid.cx()).y(math1.my() + 10);
});

sd.main(async () => {});

async function onChangeStatus(element, i, j, status) {
    element.startAnimate();
    if (status === 0) element.value(null);
    else element.value(new sd.Image(svg).href("https://th.bing.com/th/id/OIP.Vtb3jSDZ8NfnflXddRI9sQHaHa?rs=1&pid=ImgDetMain"));
    element.endAnimate();
    const math = i === 1 ? math1 : math2;
    let ans = math.math().split("");
    ans[j - 1] = String(status);
    math.startAnimate().transformMath(ans.join("")).endAnimate();
    return true;
}

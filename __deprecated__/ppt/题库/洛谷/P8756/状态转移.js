import * as sd from "@/sd";
import { interactableGrid } from "../../../work/动态规划模型/棋盘构造动态规划模型/_/InteractableGrid";

const svg = sd.svg();
const n = 3;
const m = 5;
const math1 = new sd.Math(svg, "0".repeat(m));
const math2 = new sd.Math(svg, "0".repeat(m));
const math3 = new sd.Math(svg, "0".repeat(m));
const grid = interactableGrid(n, m, {
    onChangeStatus,
    totalStatus: 2,
});

sd.init(() => {
    math1.cx(grid.cx()).y(grid.my() + 10);
    math2.cx(grid.cx()).y(math1.my() + 10);
    math3.cx(grid.cx()).y(math2.my() + 10);
});

sd.main(async () => {});

async function onChangeStatus(element, i, j, status) {
    element.startAnimate();
    if (status === 0) element.value(null);
    else element.value("Horse");
    element.endAnimate();
    const math = i === 1 ? math1 : i === 2 ? math2 : math3;
    let ans = math.math().split("");
    ans[j - 1] = String(status);
    math.startAnimate().transformMath(ans.join("")).endAnimate();
    return true;
}

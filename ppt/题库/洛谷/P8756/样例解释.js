import * as sd from "@/sd";
import { interactableGrid } from "../../../work/动态规划模型/棋盘构造动态规划模型/_/InteractableGrid"

const svg = sd.svg();
const grid = interactableGrid(5, 5, {
    onChangeStatus,
    totalStatus: 2,
});

sd.init(() => {});

sd.main(async () => {});

async function onChangeStatus(element, i, j, status) {
    element.startAnimate();
    if (status == 0) element.value(null);
    else element.value("Horse");
    element.endAnimate();
    return true;
}
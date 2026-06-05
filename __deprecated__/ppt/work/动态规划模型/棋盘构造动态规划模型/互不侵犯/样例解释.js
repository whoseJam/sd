import * as sd from "@/sd";
import { interactableGrid } from "../_/InteractableGrid";

const svg = sd.svg();
const n = 5;
const m = 5;
const grid = interactableGrid(n, m, {
    onChangeStatus,
    totalStatus: 2,
});

sd.init(() => {});

sd.main(async () => {});

async function onChangeStatus(element, i, j, status) {
    element.startAnimate();
    if (status === 0) element.value(null);
    else element.value(new sd.Image(svg).href("https://th.bing.com/th/id/OIP.Vtb3jSDZ8NfnflXddRI9sQHaHa?rs=1&pid=ImgDetMain"));
    element.endAnimate();
    return true;
}

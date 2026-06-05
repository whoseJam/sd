import * as sd from "@/sd";
import { CDQ1D } from "../_/CDQ1D";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [4, 2, 3, 6, 5, 6, 3, 4];
const arr = new sd.BarArray(svg).x(100).y(100).start(1);

sd.init(() => {
    arr.pushArray(data);
    const curve = new sd.BraceCurve(arr);
    curve.source(arr.lastElement().pos("mx", "my", 0, 3));
    curve.target(arr.firstElement().pos("x", "my", 0, 3));
    curve.value("n个数字", R.pointAtPathByRate(0.5, "cx", "y", 0, 3));
});

sd.main(async () => {
    await CDQ1D(arr);
});

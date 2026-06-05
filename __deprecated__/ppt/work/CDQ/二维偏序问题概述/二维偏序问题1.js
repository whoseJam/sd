import * as sd from "@/sd";
import { dataStructurePO2D } from "../_/PartialOrder2D";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [
    { x: 4, y: 2 },
    { x: 6, y: 1 },
    { x: 5, y: 3 },
    { x: 8, y: 4 },
    { x: 3, y: 9 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 7, y: 7 },
    { x: 9, y: 8 },
];
const coord = new sd.Coord(svg).viewBox(-1, -1, 11, 12).width(1000).height(450);
const arr = new sd.ValueArray(svg).elementWidth(coord.globalX(1) - coord.globalX(0)).start(1);
const sum = new sd.Pile(svg).resize(data.length).start(1);
const pI = sd.Pointer(arr, "i", "t");
const focus = sd.Focus(sum);

sd.init(() => {
    arr.x(coord.globalX(0.5));
    arr.y(coord.globalY(-1));
    sum.elementHeight(coord.globalY(0) - coord.globalY(1));
    sum.my(coord.globalY(0)).x(coord.globalX(0)).opacity(0);
    data.forEach(value => {
        const stk = new sd.Stack(arr).elementWidth(80);
        stk.valueX = value.x;
        stk.valueY = value.y;
        stk.push(`x=${value.x}`).push(`y=${value.y}`);
        arr.push(stk);
        arr.lastElement().circle = new sd.Circle(svg).r(6).center(coord.globalAt(value.x, value.y - 0.5));
    });
});

sd.main(async () => {
    await sd.pause();
    sum.startAnimate().opacity(1).endAnimate();
    await dataStructurePO2D(arr, {
        onSortDim1,
        onMoveI,
        onQuery,
        onInsert,
    });
});

async function onSortDim1() {
    await sd.pause();
    arr.startAnimate()
        .sort((a, b) => a.valueX - b.valueX)
        .endAnimate();
}

async function onMoveI(i) {
    await sd.pause();
    pI.startAnimate().moveTo(i).endAnimate();
}

async function onQuery(i) {
    const value = arr.element(i).valueY;
    await sd.pause();
    sd.Link(arr.element(i), arr.element(i).circle).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    sd.Link(arr.element(i).circle, sum.element(value)).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    focus.startAnimate().focus(1, value).endAnimate();
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
}

async function onInsert(i) {
    const value = arr.element(i).valueY;
    arr.element(i).circle.startAnimate().color(C.blue).endAnimate();
    sum.startAnimate()
        .value(value, sum.intValue(value) + 1)
        .endAnimate();
}

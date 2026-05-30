import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const data = [
    { op: "add(2, +3)", idx: 2, val: 3, type: "add" },
    { op: "set(4, -2)", idx: 4, val: -2, type: "set" },
    { op: "add(3, +5)", idx: 3, val: 5, type: "add" }
];
const operations = new sd.Code(svg);
const elements = new sd.Array(svg).resize(n).start(1);
sd.Index(elements);

sd.init(init);
sd.main(main);

function init() {
    operations.y(elements.my() + 40);
}

async function main() {
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        operations.startAnimate().push(data[i].op).cx(elements.cx()).endAnimate();
        await sd.pause();
        if (data[i].type === "add") {
            const idx = data[i].idx;
            const del = data[i].val;
            const val = elements.intValue(idx) + del;
            elements.startAnimate().value(idx, val).endAnimate();
        } else if (data[i].type === "set") {
            const idx = data[i].idx;
            const val = data[i].val;
            elements.startAnimate().value(idx, val).endAnimate();
        }
    }

    await sd.pause();
    const newElements = new sd.Array(svg).resize(n).start(1).cx(elements.cx()).y(operations.my() + 40);
    sd.Index(newElements);
    newElements.opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        operations.startAnimate().focus(i + 1).endAnimate();
        await sd.pause();
        if (data[i].type === "add") {
            const idx = data[i].idx;
            const del = data[i].val;
            const val = newElements.intValue(idx) + del;
            newElements.startAnimate().value(idx, val).endAnimate();
        } else if (data[i].type === "set") {
            const idx = data[i].idx;
            const val = data[i].val;
            newElements.startAnimate().value(idx, val).endAnimate();
        }
    }
}
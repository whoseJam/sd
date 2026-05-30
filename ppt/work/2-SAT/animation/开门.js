import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const keyData = [
    [1, 4],
    [2, 3],
    [5, 6],
];
const doorData = [
    [1, 2],
    [1, 3],
    [5, 2],
    [5, 3],
    [4, 6],
    [3, 3],
];
const doors = new sd.ValueArray(svg);
const keys1 = new sd.Array(svg);
const keys2 = new sd.Array(svg);
let openned = -1;
const usedKeys = new Set();

sd.init(() => {
    keyData.forEach((pair, idx) => {
        keys1.push(pair[0]);
        keys2.push(pair[1]);
        keys1.element(idx).onClick(() => {
            keys1.element(idx).onClick(() => {});
            keys2.element(idx).onClick(() => {});
            keys1.element(idx).color(C.blue);
            keys2.element(idx).color(C.grey);
            usedKeys.add(pair[0]);
            openDoors();
        });
        keys2.element(idx).onClick(() => {
            keys1.element(idx).onClick(() => {});
            keys2.element(idx).onClick(() => {});
            keys1.element(idx).color(C.grey);
            keys2.element(idx).color(C.blue);
            usedKeys.add(pair[1]);
            openDoors();
        });
    });
    doors.elementWidth(120);
    doorData.forEach(pair => {
        const door = new sd.Rect(svg).width(100).height(150);
        doors.push(door);
        door.childAs("lock1", new sd.Box(svg, pair[0]), function (parent, child) {
            child.cx(parent.cx()).cy(parent.ky(0.33));
        });
        door.childAs("lock2", new sd.Box(svg, pair[1]), function (parent, child) {
            child.cx(parent.cx()).cy(parent.ky(0.66));
        });
    });
    doors.cx(600).y(100);
    keys1.cx(600).y(240);
    sd.Label(keys1, "K1");
    keys2.cx(600).y(280);
    sd.Label(keys2, "K2");
});

sd.main(async () => {
    await sd.pause();
});

function openDoors() {
    while (
        openned + 1 < doorData.length &&
        (usedKeys.has(doorData[openned + 1][0]) || usedKeys.has(doorData[openned + 1][1]))
    ) {
        openned++;
        doors.element(openned).color(C.green);
    }
}

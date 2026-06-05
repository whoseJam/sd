import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const elements = [];
const sets = [];
const n = 6;
const fa = sd.make1d(100);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        elements[i] = new sd.Vertex(svg, i.toString())
            .cx(50 + (i - 1) * 100)
            .cy(200)
            .color(C.white);

        sets[i] = new sd.Rect(svg)
            .width(80)
            .height(80)
            .cx(50 + (i - 1) * 100)
            .cy(200)
            .borderRadius(15)
            .fillOpacity(0)
            .stroke(C.gray)
            .strokeWidth(1)
            .strokeDashArray([5, 5]);

        fa[i] = i;
    }
});

sd.main(async () => {
    await merge(1, 2);
    await merge(3, 4);
    await merge(5, 6);
    await merge(1, 5);
    await query(1, 6);
    await query(1, 3);
});

function getFa(x) {
    if (fa[x] === x) return x;
    return getFa(fa[x]);
}

function getSetElements(root) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (getFa(i) === root) {
            result.push(i);
        }
    }
    return result;
}

function updateSetRect(root) {
    const elementsInSet = getSetElements(root);
    if (elementsInSet.length === 0) return;

    const positions = elementsInSet.map(i => elements[i].cx());
    const minX = Math.min(...positions);
    const maxX = Math.max(...positions);

    sets[root]
        .startAnimate()
        .width(maxX - minX + 80)
        .height(80)
        .cx((minX + maxX) / 2)
        .endAnimate();
}

async function merge(x, y) {
    await sd.pause();

    elements[x].startAnimate().color(C.blue).endAnimate();
    elements[y].startAnimate().color(C.blue).endAnimate();
    await sd.pause();

    const fx = getFa(x);
    const fy = getFa(y);

    if (fx === fy) {
        sets[fx].startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
        await sd.pause();
        sets[fx].startAnimate().stroke(C.gray).strokeWidth(1).endAnimate();
        elements[x].startAnimate().color(C.white).endAnimate();
        elements[y].startAnimate().color(C.white).endAnimate();
        return;
    }

    sets[fx].startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    sets[fy].startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    await sd.pause();

    const elementsInFx = getSetElements(fx);
    const elementsInFy = getSetElements(fy);

    const fxPositions = elementsInFx.map(i => 50 + (i - 1) * 100);
    const fyPositions = elementsInFy.map(i => 50 + (i - 1) * 100);
    const gap = Math.abs(Math.min(...fyPositions) - Math.max(...fxPositions));

    if (gap > 150) {
        const allSets = [];
        for (let i = 1; i <= n; i++) {
            const root = getFa(i);
            if (!allSets.find(s => s.root === root)) {
                const setElems = getSetElements(root);
                const positions = setElems.map(e => 50 + (e - 1) * 100);
                allSets.push({
                    root: root,
                    elements: setElems,
                    minX: Math.min(...positions),
                    maxX: Math.max(...positions),
                    centerX: (Math.min(...positions) + Math.max(...positions)) / 2,
                });
            }
        }

        // 按位置排序
        allSets.sort((a, b) => a.centerX - b.centerX);

        const fxIndex = allSets.findIndex(s => s.root === fx);
        const fyIndex = allSets.findIndex(s => s.root === fy);

        if (Math.abs(fyIndex - fxIndex) > 1) {
            const fySet = allSets[fyIndex];
            allSets.splice(fyIndex, 1);
            const newFxIndex = allSets.findIndex(s => s.root === fx);
            allSets.splice(newFxIndex + 1, 0, fySet);

            let currentX = 50;
            for (const set of allSets) {
                const setWidth = (set.elements.length - 1) * 100;
                const newCenterX = currentX + setWidth / 2;
                const offsetX = newCenterX - set.centerX;

                for (const elemId of set.elements) {
                    const oldX = 50 + (elemId - 1) * 100;
                    elements[elemId]
                        .startAnimate()
                        .cx(oldX + offsetX)
                        .endAnimate();
                }

                sets[set.root]
                    .startAnimate()
                    .cx(set.centerX + offsetX)
                    .endAnimate();

                currentX += setWidth + 100;
            }

            await sd.pause();
        }
    }

    fa[fx] = fy;
    updateSetRect(fy);
    sets[fx].startAnimate().opacity(0).endAnimate();
    await sd.pause();

    sets[fy].startAnimate().stroke(C.gray).strokeWidth(1).endAnimate();
    elements[x].startAnimate().color(C.white).endAnimate();
    elements[y].startAnimate().color(C.white).endAnimate();
}

async function query(x, y) {
    await sd.pause();

    elements[x].startAnimate().color(C.green).endAnimate();
    elements[y].startAnimate().color(C.green).endAnimate();
    await sd.pause();

    const fx = getFa(x);
    const fy = getFa(y);

    if (fx === fy) {
        sets[fx].startAnimate().stroke(C.green).strokeWidth(3).endAnimate();
        await sd.pause();
        sets[fx].startAnimate().stroke(C.gray).strokeWidth(1).endAnimate();
    } else {
        sets[fx].startAnimate().stroke(C.orange).strokeWidth(3).endAnimate();
        sets[fy].startAnimate().stroke(C.orange).strokeWidth(3).endAnimate();
        await sd.pause();
        sets[fx].startAnimate().stroke(C.gray).strokeWidth(1).endAnimate();
        sets[fy].startAnimate().stroke(C.gray).strokeWidth(1).endAnimate();
    }

    await sd.pause();
    elements[x].startAnimate().color(C.white).endAnimate();
    elements[y].startAnimate().color(C.white).endAnimate();
}

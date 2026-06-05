import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr1 = new sd.Array(svg).x(100).y(100);
const arr2 = new sd.Array(svg).x(100).y(200);
const colors = [C.red, C.green, C.blue, C.violet];
const data1 = [0, 2, 2, 0, 1, 3, 3, 2, 2, 1, 0];
const data2 = [0, 2, 2, 0, 1, 3, 3, 2, 2, 1, 0];
const graph = new sd.BoxDAG(svg).width(60).height(40).elementWidth(40).elementHeight(40).rankDir("LR");
const table = new sd.Grid(svg).n(colors.length + 1).m(2).startN(-1).startM(1).elementWidth(60).elementHeight(20);
const now = sd.make1d(20);

sd.init(() => {
    graph.newNode(1, " ");
    graph.newNode(2, " ");
    graph.newLink(1, 2).element(1, 2).arrow();
    arr1.resize(data1.length);
    arr2.resize(data2.length);
    data1.forEach((data, index) => {
        arr1.color(index, colors[data]);
    });
    data2.forEach((data, index) => {
        arr2.color(index, colors[data]);
    });
    graph.opacity(0).cx(arr2.cx()).y(arr2.my() + 30);
    colors.forEach((color, index) => {
        table.value(index, 1, new sd.Rect(table).color(color));
        table.value(index, 2, new sd.Rect(table).color(color));
        now[index] = index;
    });
    table.value(-1, 1, "原色");
    table.value(-1, 2, "当前色");
    table.x(arr1.mx() + 50).cy((arr1.y() + arr2.my()) / 2);
})

sd.main(async () => {
    await change(0, 1);
    await change(1, 2);
    await change(2, 0);
    await change(3, 1);
    await change(0, 1);
})

function countFromAndTo(data, from, to) {
    let cntFrom = 0, cntTo = 0;
    data.forEach(value => {
        if (value === from) cntFrom++;
        else if (value === to) cntTo++;
    })
    return [cntFrom, cntTo];
}

async function change(from, to) {
    await sd.pause();
    graph.color(1, colors[from]).color(2, colors[to]);
    graph.startAnimate().opacity(1).endAnimate();
    await changeTo(arr1, data1, from, to);

    const [cntFrom, cntTo] = countFromAndTo(data2, now[from], now[to]);
    if (cntFrom > cntTo) {
        await sd.pause();
        table.startAnimate();
        table.element(from, 2).freeze();
        table.element(to, 2).freeze();
        const elementFrom = table.element(from, 2).drop();
        const elementTo = table.element(to, 2).drop();
        table.element(from, 2).valueFromExist(elementTo);
        table.element(to, 2).valueFromExist(elementFrom);
        table.element(from, 2).unfreeze();
        table.element(to, 2).unfreeze();
        table.endAnimate();
        const tmp = now[from];
        now[from] = now[to];
        now[to] = tmp;
        await changeTo(arr2, data2, now[from], now[to]);
    } else {
        await changeTo(arr2, data2, now[from], now[to]);
    }
    await sd.pause();
    graph.startAnimate().opacity(0).endAnimate();
}

async function changeTo(arr, data, from, to) {
    await sd.pause();
    arr.startAnimate();
    for (let i = 0; i < data.length; i++) {
        if (data[i] === from) {
            data[i] = to;
            arr.color(i, colors[to]);
        }
    }
    arr.endAnimate();
}
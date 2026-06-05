import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const arr = new sd.Array(svg).pushArray([2, 2, 3, 3, 2]).start(1);
const deg = new sd.Array(svg).start(1);
const n = 7;
const links = [
    [2, 1],
    [2, 3],
    [2, 4],
    [2, 7],
    [3, 5],
    [3, 6]
];

sd.init(() => {
    tree.root(2);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).opacity(0);
    });
    arr.y(tree.my() + 80);
    for (let i = 1; i <= n; i++) {
        const cnt = arr.elements().filter(element => element.intValue() === i).length + 1;
        deg.push(cnt);
    }
    sd.Index(deg, "t");
    deg.y(arr.my() + 40);
    sd.Label(deg, "节点的度");
})

sd.main(async () => {
    const p = sd.Pointer(arr, "", "b", 5, 30);
    for (let i = 1; i <= n - 2; i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        await FindAndInsert();
    }
})

async function FindAndInsert() {
    let id = n;
    for (let i = 1; i <= n; i++) {
        if (deg.intValue(i) !== 1) continue;
        if (deg.color(i).main === C.grey) continue;
        id = i;
        break;
    }
    await sd.pause();
    deg.startAnimate().color(id, C.blue).endAnimate();
    await sd.pause();
    tree.element(tree.fatherId(id), id).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    deg.startAnimate();
    deg.color(id, C.grey);
    deg.value(tree.fatherId(id), deg.intValue(tree.fatherId(id)) - 1);
    deg.endAnimate();
}
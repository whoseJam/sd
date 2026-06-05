import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg);
const backup = new sd.Tree(svg);
const n = 6;
const people = [
    [1, 4],
    [2, 6],
    [3, 1],
    [1, 5],
    [3, 3],
    [4, 3],
    [3, 1],
    [4, 2],
    [6, 4],
];
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
];

sd.init(() => {
    links.forEach(link => {
        tree.link(link[0], link[1]);
        backup.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        tree.element(i).childAs("arr", new sd.Array(svg).elementWidth(12).elementHeight(12), R.aside("tl"));
        backup.element(i).childAs("arr", new sd.Array(svg).elementWidth(12).elementHeight(12), R.aside("tl"));
    }
    people.forEach(p => {
        const [at, v] = p;
        tree.element(at).child("arr").push(v);
        backup.element(at).child("arr").push(v);
    });
    tree.x(backup.mx() + 100);
    sd.Label(backup, "备份", "bc", 15, 20);
});

sd.main(async () => {
    await greedy(1);
});

async function greedy(u) {
    const du = tree.element(u);
    const arr = du.child("arr");
    du.siz = 1;
    for (const child of tree.children(u)) {
        await greedy(tree.nodeId(child));
        du.siz += child.siz;
        if (child.child("arr").length() >= 1) {
            await sd.pause();
            child.child("arr").forEachElement(element => {
                if (element.color().fill === C.green) {
                    const clone = new sd.Box(svg).width(12).height(12).center(element.center()).value(element.intValue()).color(C.green);
                    arr.startAnimate().pushFromExistElement(clone).endAnimate();
                    clone
                        .after(arr.delay() - 300)
                        .startAnimate()
                        .color(C.white)
                        .endAnimate();
                }
            });
        }
    }
    if (arr.length() >= 1) {
        await sd.pause();
        arr.startAnimate()
            .sort((a, b) => -(a.intValue() - b.intValue()))
            .endAnimate();
        await sd.pause();
        arr.startAnimate();
        const lim = Math.min(du.siz - 1, arr.end());
        arr.color(0, lim, C.green);
        if (lim + 1 <= arr.end()) arr.color(lim + 1, arr.end(), C.grey);
        arr.endAnimate();
    }
}

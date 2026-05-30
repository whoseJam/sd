import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 15;
const arr = new sd.Array(svg).resize(n);
const tree = new sd.Tree(svg).cx(arr.cx()).y(arr.my() + 40);

sd.init(() => {
    tree.freeze();
    tree.root(1, " ");
    tree.newNode(2, "...").element(2).strokeOpacity(0).fillOpacity(0);
    tree.newNode(3, " ");
    tree.newNode(4, "...").element(4).strokeOpacity(0).fillOpacity(0);
    for (let i = 5; i <= 6; i++) tree.newNode(i, " ");
    function link(a, b) {
        tree.link(a, b).element(a, b).arrow();
    }
    link(1, 2);
    link(1, 3);
    link(1, 4);
    link(3, 5);
    link(5, 6);
    tree.unfreeze();
    for (let i = 1; i < n; i++) arr.value(i, "?");
    tree.color(6, C.red);
    arr.color(14, C.red);
    tree.color(5, C.green);
    arr.color(6, C.green);
    tree.color(3, C.blue);
    arr.color(2, C.blue);
});

sd.main(async () => {});

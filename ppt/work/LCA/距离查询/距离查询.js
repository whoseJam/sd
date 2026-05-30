import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg);

sd.init(() => {
    for (let i = 1; i <= 9; i++) tree.newNode(i, " ");
    tree.link(1, 2);
    tree.link(2, 3);
    tree.link(3, 4);
    tree.link(4, 5);
    tree.link(5, 6);
    tree.link(3, 7);
    tree.link(7, 8);
    tree.link(8, 9);
    tree.value(6, "x");
    tree.value(9, "y");
});

sd.main(async () => {});

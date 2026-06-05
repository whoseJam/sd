import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.BinaryTree(svg).width(600);
const n = 15;

sd.init(() => {
    tree.root(1);
    for (let i = 2; i <= n; i++) {
        tree.link(i >> 1, i);
    }
});

sd.main(async () => {});

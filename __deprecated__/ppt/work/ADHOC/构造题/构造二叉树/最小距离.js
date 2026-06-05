import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.BinaryTree(svg).width(500).root(1);
const n = 10;

sd.init(() => {
    for (let i = 2; i <= n; i++) tree.link(i >> 1, i);
});

sd.main(async () => {});

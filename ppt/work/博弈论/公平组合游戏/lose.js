import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg).nodeType(sd.Box).root(1, "");
tree.element(1).width(60).height(30);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    tree.freeze();
    for (let i = 2; i <= 4; i++) {
        tree.newNode(i, "win").link(1, i);
        tree.element(i).width(60).height(30);
        tree.element(1, i).arrow();
    }
    tree.unfreeze();
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate().value(1, "lose").endAnimate();
});

import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg);

sd.init(() => {
    tree.link("a", "b").link("a", "c");
});

sd.main(async () => {});

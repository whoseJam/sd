import * as sd from "@/sd";

const svg = sd.svg();
const t1 = new sd.Tree(svg).root(1).link(1, 2).link(2, 3).link(3, 4);
const t2 = new sd.Tree(svg).root(1).link(1, 2).link(1, 3).link(1, 4).dx(400);

sd.init(() => {});

sd.main(async () => {});

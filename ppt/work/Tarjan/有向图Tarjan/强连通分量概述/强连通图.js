import * as sd from "@/sd";

const svg = sd.svg();
const L = 100;
const g = new sd.GridGraph(svg).width(L).height((L * Math.sqrt(3)) / 2);

sd.init(() => {
    g.at(1, 0).newNode(1);
    g.at(0, 0.5).newNode(2);
    g.at(1, 1).newNode(3);
    for (let i = 1; i <= 3; i++) {
        const next = i === 3 ? 1 : i + 1;
        g.newLink(i, next);
        g.element(i, next).arrow();
    }
});

sd.main(async () => {});

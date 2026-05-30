import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.GridGraph(svg).width(200).height(150);

sd.init(() => {
    grid.at(0, 0).newNode(1);
    grid.at(0.5, 0).newNode(2);
    grid.at(1, 1).newNode(3);
    grid.at(1, 0.5).newNode(4);
    grid.at(1, 0).newNode(5);
    grid.at(0.5, 1).newNode(6);
    grid.at(0, 0.5).newNode(7);
    grid.at(0, 1).newNode(8);
    for (let i = 1; i <= 7; i++)
        grid.newLink(i, i + 1)
            .element(i, i + 1)
            .arrow();
});

sd.main(async () => {});

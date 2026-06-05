import * as sd from "@/sd";

const svg = sd.svg();
const g = new sd.TinyGraph(svg).width(200).height(200);
const n = 6;
const links = [
    [1, 3],
    [3, 5],
    [5, 6],
    [3, 4],
    [1, 5]
];

sd.init(() => {
    for (let i = 1; i <= n; i++)
        g.newNode(i);
    links.forEach(link => {
        g.newLink(link[0], link[1]);
    });
})

sd.main(async () => {

})
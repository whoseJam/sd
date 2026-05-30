import * as sd from "@/sd";

const svg = sd.svg();
const n = 3;
const g = new sd.TinyGraph(svg).width(200).height(200);

sd.init(() => {
    for (let i = 1; i <= n; i++) g.newNode(i);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j < i; j++) {
            g.newLink(i, j);
        }
    }
})

sd.main(async () => {

})
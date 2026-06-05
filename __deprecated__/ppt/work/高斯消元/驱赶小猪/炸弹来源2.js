import * as sd from "@/sd";

const svg = sd.svg();
const n = 6;
const tiny = new sd.TinyGraph(svg);
const center = new sd.Vertex(svg, "i");

sd.init(() => {
    center.center(tiny.center());
    for (let i = 1; i <= n; i++) {
        tiny.newNode(i, " ");
        sd.Link(tiny.element(i), center).arrow();
    }
})

sd.main(async () => {

})
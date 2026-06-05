import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).resize(1).start(1);
const rt = new sd.Vertex(svg).dy(60);

sd.init(() => {
    sd.Index(arr, "t");
})

sd.main(async () => {

})
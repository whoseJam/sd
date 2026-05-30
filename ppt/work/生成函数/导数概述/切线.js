import * as sd from "@/sd";

const svg = sd.svg();
const coord = new sd.Coord(svg).viewX(-5).viewY(-3).viewWidth(10).viewHeight(6).width(500).height(300);

sd.init(() => {
    coord.draw(1, x => x * x);
})

sd.main(async () => {
    await sd.pause();
    coord.startAnimate().draw(2, x => 2 * x);
})
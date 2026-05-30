import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const bar = new sd.BarArray(svg).pushArray("00040005").start(1);

sd.init(() => {
    sd.Label(bar.element(2), "......", "tc");
    sd.Label(bar.element(6), "......", "tc");
    sd.Label(bar.element(4), "x", "tc");
    sd.Label(bar.element(8), "$\\pm a_i$", "tc");
    sd.Pointer(bar, "i", "t").moveTo(8);
});

sd.main(async () => {});

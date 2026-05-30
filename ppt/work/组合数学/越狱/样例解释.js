import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const m = 5;
const arr = new sd.Array(svg).resize(n).start(1);
const hint = new sd.Math(svg, `n=${n},m=${m}`).cx(arr.cx()).my(arr.y() - 40);

sd.init(() => {
    sd.Index(arr, "t");
});

sd.main(async () => {});

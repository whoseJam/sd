import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const arr = new sd.Array(svg);
const str = "o+++----++--++++--+-+--o";

sd.init(() => {
    arr.resize(str.length);
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        arr.element(i).value(new sd.Math(svg, char), R.center());
    }
});

sd.main(async () => {});

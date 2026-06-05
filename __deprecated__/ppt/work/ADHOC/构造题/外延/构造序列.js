import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 16;
const m = 5;
const d = 4;
const arr = new sd.Array(svg);

sd.init(() => {
    let k = 0;
    let other = 1;
    for (let i = 1; i <= n; i++) {
        if ((i - 1) % d === 0) {
            arr.push(++k * d);
            arr.lastElement().color(C.green);
        } else {
            if (other % d === 0) other++;
            arr.push(other);
            other++;
        }
    }
    sd.Label(arr, "$m=5$", "tc");
});

sd.main(async () => {});

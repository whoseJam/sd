import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const p = 6;
const F1 = makeVector(p, "i");
const F2 = makeVector(p, "i+1").dx(200);

sd.init(() => {
    sd.Index(F1, "l");
    sd.Index(F2, "r");
});

sd.main(async () => {
    for (let k = 0; k < p; k++) {
        await sd.pause();
        const links = [];
        for (let r = 0; r < p; r++) {
            const j = (k - r + p) % p;
            const link = sd
                .Link(F1.element(j), F2.element(k), sd.Line, "mx", "cy", "x", "cy")
                .startAnimate()
                .pointStoT()
                .value(`$S_${r}$`, R.pointAtPathByRate(0.1 * k + 0.1, "cx", "y"))
                .endAnimate()
                .arrow();
            links.push(link);
        }
        await sd.pause();
        links.forEach(link => {
            link.startAnimate().opacity(0.2).endAnimate();
        });
    }
});

function makeVector(n, i) {
    const vec = new sd.Stack(svg).resize(n);
    sd.Label(vec, `$f_{${i}}$`, "tc");
    return vec;
}

import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const K = 5;
const F1 = makeVector(K + 1, "i");
const F2 = makeVector(K + 1, "i+1").dx(200);

sd.init(() => {
    sd.Index(F1, "l");
    sd.Index(F2, "r");
});

sd.main(async () => {
    for (let k = 1; k <= K; k++) {
        await sd.pause();
        const links = [];
        function add(a, b, v, y) {
            const link = sd
                .Link(F1.element(a), F2.element(b), sd.Line, "mx", "cy", "x", "cy")
                .startAnimate()
                .pointStoT()
                .value(`$${v}$`, R.pointAtPathByRate(k * 0.1, "cx", y))
                .endAnimate()
                .arrow();
            links.push(link);
        }
        {
            const j = k;
            add(j, k, j, "y");
        }
        {
            const j = k - 1;
            add(j, k, K - j, "my");
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

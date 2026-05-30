import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 12;
const data = I.readIntArray("2 3 1 3 3 1 2 2 3 2 1 2", n);
const paper = new sd.Array(svg).y(40).resize(n).start(1);
const colors = [C.coral, C.green, C.blue];
const segments = new sd.ArrayPool({
    onCreate() {
        const brace = sd.Brace(paper);
        return brace;
    },
    getUsed(brace) {
        return brace;
    },
    getIdle(brace) {
        return brace;
    },
    onIdle(brace) {
        brace.startAnimate().opacity(0).endAnimate();
    },
});
const objects = new sd.ObjectPool({
    onCreate(key) {
        const element = paper.element(key);
        return new sd.Line(svg)
            .source(element.mx(), element.y() - 10)
            .target(element.mx(), element.my() + 10)
            .stroke(C.pureBlue)
            .strokeWidth(2)
            .opacity(0);
    },
    getUsed(line) {
        line.startAnimate().opacity(1).endAnimate();
        return line;
    },
    getIdle(line) {
        line.startAnimate().opacity(1).endAnimate();
        return line;
    },
    onIdle(line) {
        line.startAnimate().opacity(0).endAnimate();
    },
});
const input = new sd.Slider(svg).width(100).cx(paper.cx()).min(1).max(8);
const score = new sd.Text(svg, input.value()).x(input.mx() + 20).cy(input.cy());
sd.Label(input, "score", "lc");

input.onChange(value => {
    sd.inter(async () => {
        await update(value);
    });
});

sd.init(() => {
    for (let i = 1; i <= n; i++) paper.color(i, colors[data[i] - 1]);
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update(input.value());
});

async function update(value) {
    if (score.text() !== String(value)) score.startAnimate().text(value).endAnimate();

    const current = sd.make1d(10);
    const getScore = () => current[1] * current[2] * current[3];
    segments.beforeAllocate();
    objects.beforeAllocate();
    for (let l = 1, r; l <= n; l = r + 1) {
        r = l;
        current[data[l]]++;
        while (r + 1 <= n) {
            r++;
            current[data[r]]++;
            if (getScore() > value) {
                r--;
                break;
            }
        }
        current[1] = current[2] = current[3] = 0;
        if (r !== n) objects.allocate(r);
        const segment = segments.allocate();
        segment.startAnimate().brace(l, r, "b").endAnimate();
    }
    segments.afterAllocate();
    objects.afterAllocate();
}

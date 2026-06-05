import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const I = sd.input();
const n = 12;
const data = I.readIntArray("4 2 4 5 1 2 3 1 5 2 4 3", n);
const arr = new sd.Array(svg).y(40).pushArray(data.slice(1)).start(1);
const segments = new sd.ArrayPool({
    onCreate() {
        const brace = sd.Brace(arr);
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
        const element = arr.element(key);
        return new sd.Line(svg)
            .source(element.mx(), element.y() - 10)
            .target(element.mx(), element.my() + 10)
            .stroke(C.red)
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

sd.init(() => {});

sd.main(async () => {
    await update(6);
});

async function update(value) {
    await sd.pause();
    let sum = 0;
    segments.beforeAllocate();
    objects.beforeAllocate();
    for (let l = 1, r; l <= n; l = r + 1) {
        r = l;
        sum += data[l];
        while (r + 1 <= n) {
            r++;
            sum += data[r];
            if (sum > value) {
                r--;
                break;
            }
        }
        sum = 0;
        if (r !== n) objects.allocate(r);
        const segment = segments.allocate();
        segment.startAnimate().brace(l, r, "b").endAnimate();
    }
    segments.afterAllocate();
    objects.afterAllocate();
}

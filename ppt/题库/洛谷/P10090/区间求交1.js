import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const main = lineWithLabel("0", "a").dx(30).width(420);
const x = main.x() - 160;
const subs = [];

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        subs.push(
            lineWithDot()
                .width(40)
                .x(x + i * 80)
                .y(i * 10)
        );
    }
});

sd.main(async () => {});

function lineWithLabel(t1, t2) {
    const line = lineWithDot();
    line.childAs(new sd.Text(line, t1), R.pointAtPathByRate(0, "cx", "my", 0, -2));
    line.childAs(new sd.Text(line, t2), R.pointAtPathByRate(1, "cx", "my", 0, -2));
    return line;
}

function lineWithDot() {
    const line = new sd.Line(svg).target(40, 0);
    line.childAs(new sd.Circle(svg).r(3).color(C.black), R.pointAtPathByRate(0));
    line.childAs(new sd.Circle(svg).r(3).color(C.black), R.pointAtPathByRate(1));
    return line;
}

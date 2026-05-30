import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const tot = 12;
const land = new sd.FixGapAxis(svg).y(40).ticks(tot);
const house = [1, 2, 8, 4, 6, 9];
const input = new sd.Slider(svg).width(100).cx(land.cx());
const distance = new sd.Text(svg, "?").x(input.mx() + 10).cy(input.cy());
const count = new sd.Text(svg, "count=?").x(distance.mx() + 20).cy(input.cy());
sd.Label(input, "distance", "lc");
input.min(1).max(8);
input.onChange(value => {
    sd.inter(async () => {
        await update(value);
    });
});

sd.init(() => {
    house.forEach(pos => {
        const box = new sd.Box(land).color(C.BLUE).scale(0.3);
        const circ = new sd.Circle(box).color(C.ORANGE);
        box.value(circ).value().opacity(0);
        land.tick(pos).childAs("value", box, R.center());
    });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update(input.value());
});

async function update(value) {
    distance.startAnimate().text(value).endAnimate();
    let lastPosition = -999;
    let cnt = 0;
    for (let i = 0; i < tot; i++) {
        if (land.tick(i).child("value")) {
            const child = land.tick(i).child("value").value();
            if (i - lastPosition >= value) {
                child.startAnimate().opacity(1).endAnimate();
                lastPosition = i;
                cnt++;
            } else {
                child.startAnimate().opacity(0).endAnimate();
            }
        }
    }
    count.startAnimate().text(`count=${cnt}`, { "count=": "count=" }).endAnimate();
}

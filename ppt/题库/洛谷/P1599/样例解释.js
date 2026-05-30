import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const data = [100, -200, 250, -200, 200];
let count = 0;
let current = 0;
const n = data.length;
const money = new sd.Text(svg, "0");
const axis = new sd.FixGapAxis(svg).ticks(n).gap(80);
axis.childAs(money, R.aside("tc", 30));
const exchange = new sd.Button(div)
    .text("交易")
    .cx(axis.cx())
    .dy(80)
    .onClick(() => {
        const tick = axis.tick(current);
        if (tick.value()) {
            sd.inter(async () => {
                money
                    .startAnimate()
                    .text(money.intValue() + tick.intValue())
                    .endAnimate();
                tick.startAnimate().value(null).endAnimate();
            });
        }
    });
new sd.Button(div)
    .text("←")
    .mx(exchange.x() - 10)
    .dy(80)
    .onClick(() => {
        if (current - 1 >= 0)
            sd.inter(async () => {
                await go(-1);
            });
    });
new sd.Button(div)
    .text("→")
    .x(exchange.mx() + 10)
    .dy(80)
    .onClick(() => {
        if (current + 1 <= n)
            sd.inter(async () => {
                await go(1);
            });
    });

sd.init(() => {
    axis.forEachTick((tick, i) => {
        if (i >= 1) {
            const value = data[i - 1];
            tick.value(value, R.pointAtPathByRate(0, "cx", "my", 0, -4));
        }
    });
});

sd.main(async () => {});

async function go(d) {
    const lastTick = axis.tick(current);
    current += d;
    const currentTick = axis.tick(current);
    new sd.Line(svg)
        .source(lastTick.pos("x", "my", 0, count * 5 + 10))
        .target(currentTick.pos("x", "my", 0, count * 5 + 10))
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    count++;
}

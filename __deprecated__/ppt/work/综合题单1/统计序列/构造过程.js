import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const arr = new sd.Array(svg).start(1);
const buttons = new sd.ValueArray(div).elementWidth(120).dy(60);

sd.init(() => {
    for (let i = 1; i <= 5; i++) {
        const _i = i;
        buttons.push(
            new sd.Button(buttons).text(i).onClick(() => {
                insert(_i);
            })
        );
    }
});

sd.main(async () => {});

function insert(v) {
    sd.inter(async () => {
        arr.startAnimate().push(v).endAnimate();
        const element = arr.lastElement();
        let fi = false;
        const i = arr.length();
        for (let j = 1; j < i; j++) {
            const fj = j === 1 ? true : arr.element(j - 1).f;
            fi |= fj && arr.intValue(j) === arr.intValue(i);
        }
        const text = new sd.Text(element, +fi).opacity(0);
        element.startAnimate().childAs(text, R.aside("tc")).endAnimate();
        element.f = fi;
    });
}

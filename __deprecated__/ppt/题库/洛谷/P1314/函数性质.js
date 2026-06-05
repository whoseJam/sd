import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const dataw = [1, 4, 3, 5, 2];
const datav = [2, 4, 2, 3, 5];
const w = new sd.Array(svg).pushArray(dataw);
const v = new sd.Array(svg).dy(80).pushArray(datav);
const slider = new sd.Slider(svg)
    .min(0)
    .max(6)
    .value(0)
    .onChange(value => {
        sd.inter(async () => {
            await update(value);
        });
    });
const currentW = new sd.Text(slider, "0");
sd.Aside(slider, currentW, "rc");

sd.init(() => {
    slider.cx(w.cx()).my(w.y() - 20);
    sd.Label(slider, "W");
    sd.Label(w, "w");
    sd.Label(v, "v");
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update(0);
});

async function update(value) {
    w.startAnimate();
    v.startAnimate();
    currentW.startAnimate().text(value).endAnimate();
    for (let i = 0; i < dataw.length; i++) {
        if (dataw[i] >= value) {
            w.color(i, C.white);
            v.color(i, C.white);
        } else {
            w.color(i, C.grey);
            v.color(i, C.grey);
        }
    }
    w.endAnimate();
    v.endAnimate();
}

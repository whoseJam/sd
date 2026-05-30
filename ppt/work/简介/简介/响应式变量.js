import * as sd from "@/sd";

const svg = sd.svg();
const r1 = new sd.Rect(svg);
const r2 = new sd.Rect(svg);
r1.childAs(r2, function (parent, child) {
    child.width(parent.width() / 2);
    child.height(parent.height() / 2);
    child.center(parent.center());
});

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    r1.startAnimate().width(200).endAnimate();
    await sd.pause();
    r1.startAnimate().x(100).endAnimate();
});

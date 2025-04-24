import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [2, 4, 2, 4, 6, 2, 3, 4];
const arr = new sd.Array(svg);
const braceL = sd.Brace(arr, "t").value("L");
const braceR = sd.Brace(arr, "b").value("R");
const coord = new sd.FixGapCoord(svg).ticks("x", data.length).ticks("y", data.length).withTickLabel("x", false).withTickLabel("y", false);

sd.init(() => {
    data.forEach(d => arr.push(d));
    arr.cx(coord.cx()).my(coord.y() - 30);
    coord.axis("x").childAs(new sd.Text(svg, "l轴"), R.aside("rc"));
    coord.axis("y").childAs(new sd.Text(svg, "r轴"), R.aside("lt"));
});

sd.main(async () => {
    await sd.pause();
    const focus = sd.Focus(arr);
    for (let i = 0; i < data.length; i++) {
        let l = i,
            r = i;
        while (l - 1 >= 0 && data[l - 1] !== data[i]) l--;
        while (r + 1 < data.length && data[r + 1] !== data[i]) r++;

        await sd.pause();
        focus.startAnimate().focus(i).endAnimate();
        await sd.pause();
        braceL.startAnimate().brace(l, i).endAnimate();
        braceR.startAnimate().brace(i, r).endAnimate();
        arr.startAnimate().color(l, r, C.green).endAnimate();
        await sd.pause();
        coord.startAnimate();
        const rect = coord
            .drawRect(l, i, i - l + 1, r - i + 1)
            .fillOpacity(0.5)
            .fill(C.green);
        coord.endAnimate();
        await sd.pause();
        braceL.startAnimate().opacity(0).endAnimate();
        braceR.startAnimate().opacity(0).endAnimate();
        arr.startAnimate().color(l, r, C.white).endAnimate();
    }
});

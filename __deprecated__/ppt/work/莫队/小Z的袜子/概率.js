import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const seq = new sd.Array(svg);
const arr = new sd.ValueArray(svg).elementWidth(60).align("my").opacity(0);
const data = [2, 1, 3, 2];
const [l, r] = [4, 11];
const seqColors = [1, 2, 2, 1, 0, 1, 0, 2, 2, 3, 3, 2, 0, 0, 3, 3];
const colors = [C.blue, C.green, C.yellow, C.purple];

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        const pile = new sd.ValuePile(arr);
        for (let j = 1; j <= data[i]; j++) {
            pile.push(new sd.Circle(pile).color(colors[i]).r(15));
        }
        arr.push(pile);
        sd.Label(pile, `$c_${i}=${data[i]}$`, "bc", 13, 0);
    }
    seq.resize(seqColors.length);
    for (let i = 0; i < seqColors.length; i++) {
        seq.color(i, colors[seqColors[i]]);
    }
    seq.cx(arr.cx()).y(arr.my() + 30);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(seq, "l", "t").startAnimate().moveTo(l).endAnimate();
    sd.Pointer(seq, "r", "t").startAnimate().moveTo(r).endAnimate();
    sd.Focus(seq).startAnimate().focus(l, r).endAnimate();
    arr.startAnimate().opacity(1).endAnimate();
});

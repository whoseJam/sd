import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const cards = new sd.ValueArray(svg).elementWidth(70).elementHeight(120).start(1);
const newCards = new sd.ValueArray(svg).elementWidth(70).elementHeight(120).dy(180).start(1);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        cards.push(makeCard(i));
    }
});

sd.main(async () => {
    await sd.pause();
    new sd.Line(svg)
        .stroke(C.red)
        .strokeWidth(3)
        .source(cards.pos("cx", "y"))
        .target(cards.pos("cx", "my"))
        .startAnimate()
        .pointStoT()
        .endAnimate();
    for (let i = 1; i <= n / 2; i++) {
        await sd.pause();
        const newCard1 = makeCard(i + n / 2).pos(cards.element(i + n / 2).pos("x", "y"));
        const newCard2 = makeCard(i).pos(cards.element(i).pos("x", "y"));
        newCards.startAnimate().pushFromExistElement(newCard1).endAnimate();
        newCards.startAnimate().pushFromExistElement(newCard2).endAnimate();
        sd.Link(cards.element(i + n / 2), newCard1, sd.Line, "cx", "my", "cx", "y")
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
        sd.Link(cards.element(i), newCard2, sd.Line, "cx", "my", "cx", "y")
            .opacity(0)
            .after(300)
            .opacity(1)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
    }
});

function makeCard(i) {
    const box = new sd.Box(svg);
    box.width(60).height(100);
    box.value(i, R.center());
    return box;
}

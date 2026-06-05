import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const coord = new sd.Coord(svg).viewBox(-5, -5, 10, 10);
const arrows = [];

const slider = new sd.Slider(svg)
    .min(2)
    .max(10)
    .onChange(value => {
        arrows.forEach(arrow => arrow.opacity(0));
        for (let i = 0; i < value; i++) {
            MakeVec(((2 * Math.PI) / value) * i);
        }
        slider.child("label").text(value);
    });
slider.childAs("label", new sd.Text(svg), R.aside("lc"));

let radius = 0;

sd.init(() => {
    coord.width(200).height(200);
    const cirlce = new sd.Circle(svg).r(80).fillOpacity(0).center(coord.center());
    radius = coord.coordX(cirlce.mx());
    slider
        .my(coord.y() - 20)
        .width(200)
        .value(5);
});

sd.main(async () => {});

function MakeVec(arc) {
    let arrow;
    for (let i = 0; i < arrows.length; i++) if (!arrows[i].opacity()) arrow = arrows[i];
    arrows.push((arrow = new sd.Line(svg).arrow().stroke(C.red)));
    arrow.opacity(1);
    arrow.source(coord.center());
    arrow.target(coord.globalAt(V.makeComplex(radius, arc)));
}

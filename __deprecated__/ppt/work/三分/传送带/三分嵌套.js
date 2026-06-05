import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const coord1 = new sd.Coord(svg).width(200).height(200);
const coord2 = new sd.Coord(svg).width(200).height(200).dx(250);

sd.init(() => {
    coord1.draw(1, x => 0.25 * (x - 0.3) * (x - 0.3) + 1);
    coord1.viewX(-2.5);
    coord2.draw(1, x => 0.55 * (x + 0.3) * (x + 0.3) + 0.6);
    coord2.viewX(-2.5);
    coord1.child(1).childAs(new sd.Math(svg, "\\mathop{min}\\limits_{f}\\{Dist(e,f)\\}"), R.pointAtPathByRate(0, "cx", "my"));
    coord2.child(1).childAs(new sd.Math(svg, "Dist(e_0,f)"), R.pointAtPathByRate(1, "cx", "my"));
    sd.Label(coord1.xAxis(), "$e$", "tr");
    sd.Label(coord2.xAxis(), "$f$", "tr");
});

sd.main(async () => {});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
makePoint("$x_j$", "$v_j$");
makePoint("$x_i$", "$v_i$").x(160);

sd.init(() => {});

sd.main(async () => {});

function makePoint(l1, l2) {
    const line = new sd.Line(svg).arrow().source(0, 0).target(80, 0);
    line.childAs("circle", new sd.Circle(svg).r(5).color(C.black), (parent, child) => {
        child.center(parent.source());
    });
    sd.Label(line.child("circle"), l1, "tc");
    sd.Label(line, l2, "bc");
    return line;
}

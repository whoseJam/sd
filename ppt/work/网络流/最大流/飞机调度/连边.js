import * as sd from "@/sd";

const svg = sd.svg();
const vi = new sd.Box(svg, label("i")).width(80);
const vj = new sd.Box(svg, label("j")).x(200).width(80);
sd.Label(vi, "$(D_i,X_i,Y_i)$", "bc");
sd.Label(vj, "$(D_j,X_j,Y_j)$", "bc");

sd.init(() => {
    sd.Link(vi, vj).arrow();
});

sd.main(async () => {});

function label(x) {
    return `航线${x}`;
}

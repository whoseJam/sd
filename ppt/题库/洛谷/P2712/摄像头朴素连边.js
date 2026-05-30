import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const dag = new sd.BoxDAG(svg).width(280).height(200).rankDir("LR");

sd.init(() => {
    dag.freeze();
    dag.elementWidth(80).elementHeight(30);
    function link(a, b, xloc, yloc, xgap, ygap) {
        dag.link(a, b);
        dag.element(a, b).arrow().value(`${a}能监视${b}`, R.pointAtPathByRate(0.5, xloc, yloc, xgap, ygap));
    }
    link("a", "b", "cx", "my", 0, -10);
    link("a", "c", "cx", "my", 0, 0);
    link("a", "d", "cx", "y", 0, 10);
    dag.unfreeze();
});

sd.main(async () => {});

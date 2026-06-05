import * as sd from "@/sd";

const svg = sd.svg();
const dag = new sd.BoxDAG(svg).width(160).height(100).rankDir("LR");

sd.init(() => {
    dag.freeze();
    dag.elementWidth(80).elementHeight(30);
    link("我", "后辈1");
    link("我", "后辈2");
    link("我", "后辈3");
    dag.unfreeze();
});

sd.main(async () => {});

function link(a, b) {
    dag.link(a, b);
    dag.element(a, b).arrow();
}

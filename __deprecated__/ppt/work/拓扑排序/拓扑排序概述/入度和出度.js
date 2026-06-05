import * as sd from "@/sd";

const svg = sd.svg();
const dag = new sd.DAG(svg).width(200).height(200).rankDir("LR");

sd.init(() => {
    dag.freeze();
    function link(a, b) {
        dag.link(a, b);
        dag.element(a, b).arrow();
    }
    link(1, 4);
    link(2, 4);
    link(3, 4);
    link(4, 5);
    link(4, 6);
    dag.unfreeze();
});

sd.main(async () => {});

import * as sd from "@/sd";

const svg = sd.svg();
const path = new sd.HorizontalValueTree(svg).height(20);

sd.init(() => {
    const genBox = node => {
        return new sd.Box(path, node).rate(1.5).width(60).strokeOpacity(0).height(30);
    };
    path.root(1, genBox(new sd.Math(path, "V_1")));
    for (let i = 2; i <= 5; i++) {
        path.newNode(i, genBox(new sd.Math(path, `V_${i}`)));
        path.newLink(i - 1, i);
    }
    path.newNode(6, genBox(new sd.Text(path, "...")));
    path.newLink(5, 6);
    path.newNode(7, genBox(new sd.Math(path, "V_m")));
    path.newLink(6, 7);
    for (let i = 1; i < 7; i++) {
        path.element(i, i + 1).arrow();
    }
    for (let i = 1; i <= 7; i++) {
        path.element(i).fillOpacity(0);
    }
    path.layerWidth(100);
});

sd.main(async () => {
    await sd.pause();
});

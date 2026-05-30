import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestGaussianBlur);

async function TestGaussianBlur() {
    const filter = new sd.Filter({
        targetNode: svg,
        id: "filter",
    });
    const gaussianBlur = new sd.GaussianBlur({
        targetNode: filter,
        stdDeviation: 5,
    });
    const rect = new sd.Rect({
        targetNode: svg,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: "red",
        filter: "url(#filter)",
    });

    await sd.pause();
    gaussianBlur.startAnimate().setStdDeviation(2).endAnimate();
}

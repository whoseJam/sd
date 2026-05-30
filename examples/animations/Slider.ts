import * as sd from "@/sd";

const svg = sd.svg();

sd.main(TestPosition);

async function TestPosition() {
    const slider = new sd.Slider({
        targetNode: svg,
        x: 100,
        y: 100,
    });
    await sd.pause();
    slider.startAnimate().setX(200).setY(200).setWidth(500).setHeight(50).endAnimate();
}

async function TestValueWatch() {
    const slider = new sd.Slider({
        targetNode: svg,
    }).onValueChanged((vn, vo) => {
        console.log("value changed value=", vn, vo);
    });
}

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const str = "abbaaca";
const arr = new sd.Array(svg).start(1).x(100).y(100);
const startInput = new sd.Input(svg);
const endInput = new sd.Input(svg);
const button = new sd.Button(svg).text("查询");

sd.init(() => {
    arr.pushArray(str);
    for (let i = 1; i <= arr.length(); i++) {
        const element = arr.element(i);
        element.label = sd.Label(element, str.slice(0, i), "tc", 8, 1);
    }
    startInput.x(arr.x()).y(arr.my() + 20);
    endInput.x(arr.x()).y(startInput.my() + 20);
    sd.Label(startInput, "左端点");
    sd.Label(endInput, "右端点");
    button.x(arr.x()).y(endInput.my() + 20);
    button.onClick(() => {
        const start = parseInt(startInput.value());
        const end = parseInt(endInput.value());
        if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > arr.length()) return;
        sd.inter(async () => {
            arr.startAnimate().color(start, end, C.blue).endAnimate();
            await sd.pause();
            const leftLabel = arr.element(start - 1).label;
            const rightLabel = arr.element(end).label;
            const leftLabelClone = new sd.Text(svg, leftLabel.text()).x(leftLabel.x()).y(leftLabel.y()).fontSize(leftLabel.fontSize());
            const rightLabelClone = new sd.Text(svg, rightLabel.text()).x(rightLabel.x()).y(rightLabel.y()).fontSize(rightLabel.fontSize());
            leftLabelClone
                .startAnimate()
                .mx(arr.mx())
                .y(arr.my() + 10)
                .endAnimate();
            rightLabelClone
                .startAnimate()
                .mx(arr.mx())
                .y(leftLabelClone.my() + 10)
                .endAnimate();
            await sd.pause();
            leftLabelClone
                .startAnimate()
                .text(leftLabelClone.text() + "0".repeat(end - start + 1))
                .mx(arr.mx())
                .endAnimate();
            await sd.pause();
            leftLabelClone.startAnimate().opacity(0).endAnimate().remove();
            rightLabelClone.startAnimate().opacity(0).endAnimate().remove();
        });
    });
});

sd.main(async () => {});

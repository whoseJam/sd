import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestPauseForMilliseconds);

async function TestPauseForMilliseconds() {
    const circle = new sd.Circle(svg).cx(300).cy(200).r(30).fill(C.red);
    const text = new sd.Text(svg).x(300).y(350).text("Starting...");
    await sd.pause(500);
    text.startAnimate().text("Pausing for 500ms...").endAnimate();
    circle.startAnimate().fill(C.blue).endAnimate();
    await sd.pause(500);
    text.startAnimate().text("Pausing for 1000ms...").endAnimate();
    circle.startAnimate().fill(C.green).cx(600).endAnimate();
    await sd.pause(1000);
    text.startAnimate().text("Pausing for 1500ms...").endAnimate();
    circle.startAnimate().fill(C.yellow).cx(900).endAnimate();
    await sd.pause(1500);
    text.startAnimate().text("Multiple 200ms pauses...").endAnimate();
    for (let i = 0; i < 5; i++) {
        circle
            .startAnimate()
            .cy(50 + i * 20)
            .fill(i % 2 === 0 ? C.purple : C.orange)
            .endAnimate();
        await sd.pause(200);
    }
    await sd.pause();
    text.startAnimate().text("Test completed!").endAnimate();
    circle.startAnimate().fill(C.green).r(50).cx(600).cy(200).endAnimate();
}

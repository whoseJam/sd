import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const loopCount = new sd.Text(svg, "loopCount=?");
const code = new sd.Code(svg).y(30);
const rect = sd.Focus(code);
const loopLabel = sd.Label(rect, "loop(?)");

sd.init(() => {});

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        loopCount.startAnimate().text(`loopCount=${i}`, { "loopCount=": "loopCount=" }).endAnimate();
        if (i > 1) {
            await sd.pause();
            if (i > 2) {
                loopLabel
                    .startAnimate()
                    .text(`loop(${i - 1})`, [
                        ["loop(", "loop("],
                        [")", ")"],
                    ])
                    .endAnimate();
            } else loopLabel.text("loop(1)");
            rect.startAnimate()
                .focus(code.element(1), code.element(i - 1))
                .endAnimate();
        }

        await sd.pause();
        code.startAnimate();
        code.forEachElement(element => {
            element.text("    " + element.text(), [[element.text(), element.text()]]);
        });
        code.insert(1, `for(int i${i}=1;i${i}<=n;i${i}++)`);
        code.endAnimate();
    }
});

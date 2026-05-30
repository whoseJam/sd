import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "\\{a\\}=\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\}");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate().text("D(\\{a\\})=D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\})").endAnimate();
    await sd.pause();
    math.startAnimate()
        .text("S(D(\\{a\\}))=S(D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\}))", [
            ["D(\\{a\\})", "D(\\{a\\})"],
            ["=", "="],
            ["D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\})", "D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\})"],
        ])
        .endAnimate();
    await sd.pause();
    math.startAnimate()
        .text("\\{a\\}=S(D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\}))", [
            ["=S(D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\}))", "=S(D(\\{c_1\\}+\\{c_2\\}+...+\\{c_m\\}))"],
            ["\\{a\\}", "\\{a\\}"],
        ])
        .endAnimate();
    await sd.pause();
    math.startAnimate().text("\\{a\\}=S(D(\\{c_1\\})+D(\\{c_2\\})+...+D(\\{c_m\\}))").endAnimate();
});

import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
// const rect = new sd.Rect(svg);
// const circle = new sd.Circle(svg).x(100);
// const button = new sd.Button(div);
// const input = new sd.Input(div).x(100);
const slider = new sd.Slider(div).x(200);

sd.init(() => {});

sd.main(async () => {
    sd.Focus(slider).focus();
    await sd.pause();
    console.log(window.SVG_MINX, window.SVG_MINY);
    console.log(window.SVG_MAXX, window.SVG_MAXY);
});

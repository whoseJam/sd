import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(async () => {
    const rect = new sd.Rect(svg).x(100).y(100);
    await sd.pause();
    new sd.Circle(svg).r(5).center(rect.cx(), rect.cy());
    await sd.pause();
    new sd.Circle(svg).r(5).center(rect.pos("x", "y"));
    await sd.pause();
    new sd.Circle(svg).r(5).center(rect.pos("cx", "y"));
    await sd.pause();
    new sd.Circle(svg).r(5).center(rect.pos("mx", "y"));
    await sd.pause();
    new sd.Circle(svg).r(5).center(rect.mx(), rect.my());
    await sd.pause();
    new sd.Circle(svg).r(5).cx(rect.x()).my(rect.my());
});

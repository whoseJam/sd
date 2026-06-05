import * as sd from "@/sd";

const svg = sd.svg();
const axis = new sd.Axis(svg).tickAlign("source");
const data = [1, 3, 4, 6, 8];

sd.init(() => {
    data.forEach(value => {
        new sd.Circle(svg).r(5).center(axis.global(value + 0.5));
    });
});

sd.main(async () => {});

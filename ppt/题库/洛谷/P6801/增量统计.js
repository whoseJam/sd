import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const data = [1, 1, 3, 3, 2, 2, 5, 5, 5];

sd.init(() => {
    grid.axis("col").align("my");
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]; j++) {
            grid.insert(i, j);
        }
    }
});

sd.main(async () => {
    await sd.pause();
    grid.startAnimate();
    for (let i = data.length; i <= data.length + 2; i++) {
        for (let j = 0; j < 4; j++) {
            grid.insert(i, j);
            grid.color(i, j, C.blue);
        }
    }
    grid.endAnimate();
    await sd.pause();
    const braceWi = sd
        .Brace(grid)
        .brace(grid.element(data.length, 0), grid.element(data.length + 2, 0), "b")
        .value(new sd.Math(svg, "w_i"));
    braceWi.opacity(0).startAnimate().opacity(1).endAnimate();
    const braceHi = sd
        .Brace(grid)
        .brace(grid.element(data.length + 2, 3), grid.element(data.length + 2, 0), "r")
        .value(new sd.Math(svg, "h_i"));
    braceHi.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();

    let cnt = 0,
        cur = Math.min(data[data.length - 1], 4);
    const grad = C.gradient(C.red, C.white, 0, 3);
    for (let i = data.length - 1; i >= 0; i--) {
        grid.startAnimate();
        for (let j = 0; j < cur; j++) {
            grid.color(i, j, grad(cnt));
        }
        grid.endAnimate();
        if (i >= 1 && data[i - 1] < cur) {
            cur = data[i - 1];
            cnt++;
        }
    }

    const braceWj = sd.Brace(grid).value(new sd.Math(svg, "w_j"));
    const braceHj = sd.Brace(grid).value(new sd.Math(svg, "h_j"));
    for (let i = data.length - 1, j; i >= 0; i = j - 1) {
        j = i;
        while (j - 1 >= 0 && data[j - 1] === data[i]) j--;
        await sd.pause();
        braceWj.startAnimate().brace(grid.element(j, 0), grid.element(i, 0), "b").endAnimate();
        braceHj
            .startAnimate()
            .brace(grid.element(j, 0), grid.element(j, data[i] - 1), "l")
            .endAnimate();
    }
});

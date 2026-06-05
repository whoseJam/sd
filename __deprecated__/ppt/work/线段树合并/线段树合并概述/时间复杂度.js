import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;

sd.init(() => {
    const arr1 = [];
    const arr2 = [];
    for (let i = 0; i < n; i++) {
        const arr = new sd.Array(svg)
            .resize(n)
            .y(i * 50)
            .color(C.red);
        if (i > 0) sd.Label(arr, "+", "lc");
        arr1.push(arr);
    }

    for (let i = 0; i < n; i++) {
        const arr = new sd.Array(svg)
            .resize(n)
            .x(300)
            .y(i * 50)
            .color(i, C.red);
        if (i > 0) sd.Label(arr, "+", "lc");
        arr2.push(arr);
    }
    sd.Brace(svg)
        .brace(arr2[0], arr2[n - 1], "r")
        .value("n个序列");
    sd.Brace(arr1[0])
        .brace(0, n - 1, "t")
        .value("n个元素");
    sd.Brace(arr2[0])
        .brace(0, n - 1, "t")
        .value("n个元素");
});

sd.main(async () => {});

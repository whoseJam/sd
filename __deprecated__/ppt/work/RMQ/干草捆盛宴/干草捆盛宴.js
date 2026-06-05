import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tstData = [2, 3, 2, 1, 4, 2, 4, 3, 1];
const spyData = [4, 1, 2, 3, 6, 4, 7, 8, 5];
const arr = new sd.Array(svg).x(40).y(40).pushArray(tstData);
const spy = new sd.Array(svg).x(40).y(100).pushArray(spyData);
const pL = sd.Pointer(arr, "l", "b");
const pR = sd.Pointer(arr, "r", "b");
const M = 6;

new sd.Math(svg, `sum(F_i)\\ge${M}`).mx(arr.cx() - 10).my(arr.y() - 60);
const sumLabel = new sd.Math(svg, "sum(F_i)=0").x(arr.cx() + 10).my(arr.y() - 60);
sd.Label(arr, "S", "lc");
sd.Label(spy, "F", "lc");

sd.init(() => {});

sd.main(async () => {
    const brace = sd.Brace(spy).location("b").value("$max\\{S_i\\}$");
    for (let i = 0, j = 0, sum = 0; i < tstData.length; i++) {
        await sd.pause();
        if (i > 0) {
            sum -= tstData[i - 1];
            sumLabel.startAnimate().text(`sum(F_i)=${sum}`, { "sum(F_i)=": "sum(F_i)=" }).endAnimate();
        }
        arr.startAnimate();
        pL.moveTo(i);
        arr.endAnimate();
        while (j < tstData.length && sum < M) {
            await sd.pause();
            sum += tstData[j];
            sumLabel.startAnimate().text(`sum(F_i)=${sum}`, { "sum(F_i)=": "sum(F_i)=" }).endAnimate();
            arr.startAnimate();
            pR.moveTo(j);
            arr.endAnimate();
            j++;
            if (sum >= M) break;
        }
        if (sum < M) continue;
        await sd.pause();
        arr.startAnimate()
            .color(i, j - 1, C.green)
            .endAnimate();
        brace
            .startAnimate()
            .brace(i, j - 1)
            .opacity(1)
            .endAnimate();
        await sd.pause();
        arr.startAnimate();
        arr.color(C.white);
        arr.endAnimate();
        brace.startAnimate().opacity(0).endAnimate();
    }
});

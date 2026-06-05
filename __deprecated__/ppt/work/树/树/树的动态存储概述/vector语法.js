import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(400).y(100).opacity(0);
sd.Label(arr, "x", "lc", 20);
const code = new sd.Code(svg)
    .code(
        `
vector<int>x;
x.push_back(1);
x.push_back(5);
cout<<x[0]<<endl;
cout<<x[1]<<endl;
cout<<x[2]<<endl;
cout<<x.size()<<endl;
x.push_back(6);
x.pop_back();
x.pop_back();
`
    )
    .x(700)
    .y(100);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    code.startAnimate().focus(1).endAnimate();
    await sd.pause();
    arr.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    code.startAnimate().focus(2).endAnimate();
    await sd.pause();
    arr.startAnimate().push(1).endAnimate();

    await sd.pause();
    code.startAnimate().focus(3).endAnimate();
    await sd.pause();
    arr.startAnimate().push(5).endAnimate();

    await sd.pause();
    code.startAnimate().focus(4).endAnimate();
    await sd.pause();
    arr.startAnimate().color(0, C.green).endAnimate();
    await sd.pause();
    arr.startAnimate().color(0, C.white).endAnimate();
    await sd.pause();
    code.startAnimate().focus(5).endAnimate();
    await sd.pause();
    arr.startAnimate().color(1, C.green).endAnimate();
    await sd.pause();
    arr.startAnimate().color(1, C.white).endAnimate();
    await sd.pause();
    code.startAnimate().focus(6).endAnimate();
    await sd.pause();
    code.startAnimate().focus(7).endAnimate();

    await sd.pause();
    code.startAnimate().focus(8).endAnimate();
    await sd.pause();
    arr.startAnimate().push(6).endAnimate();

    await sd.pause();
    code.startAnimate().focus(9).endAnimate();
    await sd.pause();
    arr.startAnimate().pop().endAnimate();

    await sd.pause();
    code.startAnimate().focus(10).endAnimate();
    await sd.pause();
    arr.startAnimate().pop().endAnimate();
});

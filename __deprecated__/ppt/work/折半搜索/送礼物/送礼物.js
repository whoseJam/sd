import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 6;
const W = 20;
const data = I.readIntArray("7 5 4 10 1 2", n, false);
const maxW = new sd.Text(svg, `W = ${W}`);

const arr1 = new sd.Array(svg);
const arr2 = new sd.Array(svg);

sd.init(() => {
    const mid = Math.floor(n / 2);
    for (let i = 0; i < mid; i++)
        arr1.push(data[i]);
    for (let i = mid; i < n; i++) {
        arr2.push(data[i]);
    }
    arr1.x(100).y(100);
    arr2.x(arr1.mx()).y(arr1.y());
    maxW.cx((arr1.x() + arr2.mx())/2).my(arr1.y() - 20);
})

sd.main(async () => {
    await sd.pause();
    arr1.startAnimate().dx(-50).endAnimate();
    arr2.startAnimate().dx(50).endAnimate();
    await sd.pause();

    const stk1 = new sd.Stack(arr1).elementWidth(80).elementHeight(20);
    arr1.childAs("stk", stk1, R.aside("bc", 30));
    const stk2 = new sd.Stack(arr2).elementWidth(80).elementHeight(20);
    arr2.childAs("stk", stk2, R.aside("bc", 30));

    arr1.startAnimate(); dfs(arr1, 0, 0); arr1.endAnimate();
    arr2.startAnimate(); dfs(arr2, 0, 0); arr2.endAnimate();
    sd.Label(stk1, "L", "tc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Label(stk2, "R", "tc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    stk1.startAnimate().sort().endAnimate();
    stk2.startAnimate().sort().endAnimate();
    
    const focus = sd.Focus(stk2);
    for (let i = 0; i < stk1.length(); i++) {
        await sd.pause();
        let flag = 0;
        stk1.startAnimate().color(i, C.orange).endAnimate();
        for (let j = stk2.length() - 1; j >= 0; j--) {
            if (stk2.intValue(j) + stk1.intValue(i) <= W) {
                await sd.pause();
                flag = stk2.intValue(j) + stk1.intValue(i);
                focus.startAnimate().focus(j).endAnimate();
                break;
            }
        }
        if (!flag) focus.startAnimate().focus(null).endAnimate();
        else sd.Label(stk1.element(i), flag, "lc", "10").opacity(0).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        stk1.startAnimate().color(i, C.white).endAnimate();
    }
})

function dfs(arr, dep, cur) {
    if (dep === arr.length()) {
        arr.child("stk").push(cur);
        return;
    }
    dfs(arr, dep + 1, cur);
    dfs(arr, dep + 1, cur + arr.intValue(dep));
}
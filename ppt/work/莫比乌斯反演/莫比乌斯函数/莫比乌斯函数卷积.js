import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const prim = [2, 3, 5, 7, 11, 13, 17, 19];
const dividers = [];
let n = 20;
const H = 70;

const slider = new sd.Slider(svg).min(5).max(20).value(20).width(300).cx(100).my(-10);
sd.Label(slider, "n", "lc");
const label = sd.Label(slider, "20", "rc");
slider.onChange(value => label.text((n = value)));

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const math = new sd.Math(svg, `${n}=${Divide(n)}`).cx(100).opacity(0).startAnimate().opacity(1).endAnimate();
    const m = dividers.length;
    for (let i = 0; i <= m; i++) {
        for (let S = 0; S < 1 << m; S++) {
            if (BitCount(S) === i) {
                await Combination();
            }
        }
    }
});

function Divide(n) {
    let ans = "";
    for (let i = 0; i < prim.length; i++) {
        while (n % prim[i] === 0) {
            n /= prim[i];
            dividers.push(prim[i]);
            if (ans.length === 0) ans = ans + `{${String(prim[i])}}`;
            else ans = ans + "\\times " + `{${String(prim[i])}}`;
        }
    }
    return ans;
}

function BitCount(S) {
    let ans = 0;
    while (S) {
        if (S & 1) ans++;
        S >>= 1;
    }
    return ans;
}

async function Combination(status) {
    // for (let i = )
}

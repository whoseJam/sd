import * as sd from "@/sd";
import { XorLinearSet } from "../_/XorLinearSet";

const svg = sd.svg();
const n = 4;
const set = new XorLinearSet(svg, n, [1, 5, 9, 4]);

sd.init(() => {});

sd.main(async () => {
    let ans = 0;
    const math = new sd.Math(svg, "0".repeat(n)).cx(set.cx()).my(set.y() - 20);
    const pointer = sd.Pointer(svg, "cur", "r", 40);
    for (let i = set.dim() - 1; i >= 0; i--) {
        await sd.pause();
        pointer
            .startAnimate()
            .moveTo(set.element(i, set.dim() - 1))
            .endAnimate();
        if ((ans ^ set.base(i)) > ans) {
            await sd.pause();
            ans ^= set.base(i);
            math.startAnimate().transformMath(castBinToStr(ans)).endAnimate();
        }
    }
});

function castBinToStr(v) {
    let ans = "";
    for (let i = n; i >= 1; i--) ans = ans + String((v >> (i - 1)) & 1);
    return ans;
}

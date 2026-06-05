import * as sd from "@/sd";
import { XorLinearSet } from "../_/XorLinearSet";

const svg = sd.svg();
const n = 4;
const set = new XorLinearSet(svg, n);
const tree = new sd.BinaryTree(svg).width(500).x(set.mx()).y(set.y());
const data = [1, 5, 9, 13, 4];
const counter = new sd.Math(svg, `count={0}`);
let currentCounter = 0;

sd.init(() => {
    counter.cx(set.cx()).y(set.my() + 20);
});

sd.main(async () => {
    for (let i = 0; i < data.length; i++) {
        await set.insertAsync(data[i]);
        if (i + 1 - set.size() !== currentCounter) {
            counter
                .startAnimate()
                .transformMath(`count={${(currentCounter = i + 1 - set.size())}}`)
                .endAnimate();
        }
    }
    await sd.pause();
    const pointer = sd.Pointer(svg, "cur", "r", 40);
    let tot = 1;
    tree.startAnimate().root(1, math(0)).endAnimate();
    let current = [[1, 0]];
    for (let i = set.dim() - 1; i >= 0; i--) {
        let next = [];
        await sd.pause();
        pointer
            .startAnimate()
            .moveTo(set.element(i, set.dim() - 1))
            .endAnimate();
        if (set.base(i)) {
            await sd.pause();
            tree.startAnimate().freeze();
            for (let j = 0; j < current.length; j++) {
                const [id, value] = current[j];
                if (value < (value ^ set.base(i))) {
                    tree.newNode(tot + 1, math(value));
                    tree.newLink(id, tot + 1);
                    next.push([++tot, value]);
                    tree.newNode(tot + 1, math(value ^ set.base(i)));
                    tree.newLink(id, tot + 1);
                    next.push([++tot, value ^ set.base(i)]);
                } else {
                    tree.newNode(tot + 1, math(value ^ set.base(i)));
                    tree.newLink(id, tot + 1);
                    next.push([++tot, value ^ set.base(i)]);
                    tree.newNode(tot + 1, math(value));
                    tree.newLink(id, tot + 1);
                    next.push([++tot, value]);
                }
            }
            tree.unfreeze().endAnimate();
            current = next;
        }
    }
});

function math(v) {
    return new sd.Math(svg, castBinToStr(v));
}

function castBinToStr(v) {
    let ans = "";
    for (let i = n; i >= 1; i--) ans = ans + String((v >> (i - 1)) & 1);
    return ans;
}

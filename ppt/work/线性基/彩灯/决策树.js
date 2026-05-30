import * as sd from "@/sd";
import { XorLinearSet } from "../_/XorLinearSet";

const svg = sd.svg();
const n = 4;
const set = new XorLinearSet(svg, n, [1, 5, 9, 4]);
const tree = new sd.BinaryTree(svg).width(500).x(set.mx()).y(set.y());

sd.init(() => {});

sd.main(async () => {
    const pointer = sd.Pointer(svg, "cur", "r", 40);
    let tot = 1;
    tree.root(1, math(0));
    let current = [[1, 0]];
    for (let i = set.dim() - 1; i >= 0; i--) {
        let next = [];
        if (set.base(i)) {
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

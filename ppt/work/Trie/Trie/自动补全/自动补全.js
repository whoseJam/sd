import * as sd from "@/sd";
import { buildTrieTreeSync } from "../../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
// const dict = [
//     "dab",
//     "ba",
//     "ab",
//     "daa",
//     "aa",
//     "aaa",
//     "aab",
//     "abc",
//     "ac",
//     "dadba"
// ]
const dict = ["aaaba", "aa", "aaabb", "abaab", "aba", "ababb", "abbab"];
const tree = new sd.Tree(svg).width(600);

sd.init(() => {
    buildTrieTreeSync(tree, dict, {
        onReachEndOfString(u) {
            tree.element(u).stroke(C.red).strokeWidth(2);
        },
    });
});

sd.main(async () => {});

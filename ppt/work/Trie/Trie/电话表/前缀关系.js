import * as sd from "@/sd";
import { buildTrieTreeSync } from "../../_/BuildTrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const username = ["2354", "2364", "23", "1454"];
const tree = new sd.Tree(svg).x(600).y(100).layerHeight(80);
const usernameTables = new sd.Code(svg);

sd.init(() => {
    usernameTables.fontSize(30);
    usernameTables.mx(tree.x() - 50).y(tree.y());
    username.forEach(name => usernameTables.push(name));
    buildTrieTreeSync(tree, username, {
        onReachEndOfString(u) {
            tree.element(u).stroke(C.red).strokeWidth(2);
        },
    });
});

sd.main(async () => {});

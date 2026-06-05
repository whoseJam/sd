import * as sd from "@/sd";
import { insertTrieTree } from "../../_/InsertTrieTree";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
let cnt = 1;
let ch = {};
const username = ["hello", "hi", "hella", "hill"];
const tree = new sd.Tree(svg).root(1).x(600).y(100).layerHeight(80);
const focus = sd.Focus(tree);
const usernameTables = new sd.Code(svg);

sd.init(() => {
    usernameTables.fontSize(30);
    usernameTables.mx(tree.x() - 50).y(tree.y());
    username.forEach(name => usernameTables.push(name));
});

sd.main(async () => {
    for (let i = 0; i < username.length; i++) {
        await sd.pause();
        const arr = new sd.Array(svg);
        arr.x(usernameTables.x()).my(usernameTables.y() - 30);
        arr.pushArray(username[i]).opacity(0).startAnimate().opacity(1).endAnimate();
        const pointer = sd.Pointer(arr, "i", "b");

        await insertTrieTree(tree, username[i], {
            async onMoveU(u) {
                await sd.pause();
                focus.startAnimate().focus(u).endAnimate();
            },
            async onInsertI(i) {
                await sd.pause();
                pointer.startAnimate().moveTo(i).endAnimate();
            },
            async onReachEndOfString(u) {
                await sd.pause();
                focus.startAnimate().focus(null).endAnimate();
                tree.startAnimate();
                tree.element(u).strokeWidth(2).stroke(C.red);
                tree.endAnimate();
                await sd.pause();
                arr.startAnimate().opacity(0).remove();
            },
        });
    }
});

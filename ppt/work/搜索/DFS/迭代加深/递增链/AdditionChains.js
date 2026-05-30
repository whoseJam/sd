import * as sd from "@/sd";

const svg = sd.svg();
const n = 7;
const tree = new sd.ValueTree(svg).width(1000);
const UNIQUE = true;
const ASCEND = true;
tree.dy(22);
let tot = 1;

init();
main();

function makeSplit(arr) {
    let result;
    const myId = tot;
    const array = new sd.Array(tree).elementWidth(20).elementHeight(20);
    for (let i = 0; i < arr.length; i++)
        array.push(arr[i]);
    result = array;
    
    result.onClick(() => {
        result.onClick(() => {});
        const lim = arr.length ? arr[arr.length - 1] : n;
        tree.freeze();
        const uset = new Set(arr);
        for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < arr.length; j++) {
                const v = arr[i] + arr[j];
                if (v > n) break;
                if (uset.has(v) && UNIQUE) continue;
                if (v <= arr[arr.length - 1] && ASCEND) continue;
                uset.add(v);
                const newArr = [...arr, v];
                tree.newNode(++tot, makeSplit(newArr));
                tree.newLink(myId, tot);
            }
        }
        tree.unfreeze();
    });
    return result;
}

function init() {
    tree.root(1, makeSplit([1]));
}

async function main() {
    await sd.pause();
}

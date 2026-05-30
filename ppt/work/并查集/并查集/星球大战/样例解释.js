import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const links = I.readIntMatrix(
    `
0 1
1 6
6 5
5 0
0 6
1 2
2 3
3 4
4 5
1 7
2 7
6 7
3 6`,
    13,
    2,
    false
);
const attack = [1, 6, 3, 5, 7];
const n = 8;
const dag = new sd.DAG(svg).cx(600).cy(300);

for (let i = 0; i < n; i++) dag.newNode(i);
links.forEach(link => {
    dag.newLink(link[0], link[1]);
});

sd.main(async () => {
    for (let i = 0; i < attack.length; i++) {
        await update(i);
    }
});

async function update(value) {
    await sd.pause();
    dag.startAnimate();
    function isAttacked(x) {
        for (let i = 0; i < value; i++) if (attack[i] === x) return true;
        return false;
    }
    for (let i = 0; i < n; i++) {
        if (isAttacked(i)) dag.color(i, C.grey);
        else dag.color(i, C.white);
    }
    links.forEach(link => {
        if (isAttacked(link[0]) || isAttacked(link[1])) {
            dag.opacity(link[0], link[1], 0);
        } else {
            dag.opacity(link[0], link[1], 1);
        }
    });
    dag.endAnimate();
}

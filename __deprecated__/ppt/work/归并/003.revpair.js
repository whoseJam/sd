import { sd } from "@/sd";

function len(x) {
    return x.length - 1;
}

let svg = sd.svg();
let C = sd.Color;
let a1 = sd.Array(svg).drag(true).x(100).y(100).start_from(1);
let v1 = [0, 3, 4, 5, 8, 9, 10, 11, 12, 12, 13];
let a2 = sd.Array(svg).drag(true).x(100).y(150).start_from(1);
let v2 = [0, 2, 3, 4, 5, 6, 6, 7, 9, 12, 12, 13];

for (let i = 1; i <= len(v1); i++)
    a1.push(sd.Text(a1, v1[i]));
for (let i = 1; i <= len(v2); i++)
    a2.push(sd.Text(a2, v2[i]));

async function main() {
    await sd.pause();
    let p = 0;
    for (let i = 1; i <= len(v1); i++) {
        a1.start_animate();
        if (i - 1 > 0) a1.color(i - 1, C.white);
        a1.color(i, C.red);
        a1.end_animate();
        await sd.pause();

        while (p + 1 <= len(v2) && v2[p + 1] < v1[i]) {
            a2.start_animate();
            if (p != 0) a2.color(p, C.white);
            a2.color(p + 1, C.green);
            a2.end_animate();
            await sd.pause();
            p++;
        }
    }
}

main();
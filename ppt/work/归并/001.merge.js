import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let a1 = sd.Array(svg).start_from(1).drag(true);
let a2 = sd.Array(svg).start_from(1).drag(true);
let a3 = sd.Array(svg).drag(true);
let v1 = [0, 1, 2, 5, 6, 8];
let v2 = [0, 3, 3, 7, 9];
a1.x(100).y(100);
a2.x(100).y(150);
a3.x(100).y(200).push(sd.Text(a3, "Ans"));

function len(x) {
    return x.length - 1;
}

for (let i = 1; i <= len(v1); i++)
    a1.push(sd.Text(a1, v1[i]));
for (let i = 1; i <= len(v2); i++) 
    a2.push(sd.Text(a2, v2[i]));

main();

async function main() {
    let p1 = 1, p2 = 1;
    a1.color(p1, C.green);
    a2.color(p2, C.green);
    await sd.pause();

    while (p1 <= len(v1) && p2 <= len(v2)) {
        if (v1[p1] < v2[p2]) {
            a3.start_animate().push(sd.Text(a3, v1[p1])).end_animate();
            a1.start_animate();
            a1.color(p1, C.white);
            if (p1 + 1 <= len(v1)) a1.color(p1 + 1, C.green);
            a1.end_animate();
            await sd.pause();
            p1++;
        } else {
            a3.start_animate().push(sd.Text(a3, v2[p2])).end_animate();
            a2.start_animate();
            a2.color(p2, C.white);
            if (p2 + 1 <= len(v2)) a2.color(p2 + 1, C.green);
            a2.end_animate();
            await sd.pause();
            p2++;
        }
    }
    while (p1 <= len(v1)) {
        a3.start_animate().push(sd.Text(a3, v1[p1])).end_animate();
        a1.start_animate();
        a1.color(p1, C.white);
        if (p1 + 1 <= len(v1)) a1.color(p1 + 1, C.green);
        a1.end_animate();
        await sd.pause();
        p1++;
    }
    while (p2 <= len(v2)) {
        a3.start_animate().push(sd.Text(a3, v2[p2])).end_animate();
        a2.start_animate();
        a2.color(p2, C.white);
        if (p2 + 1 <= len(v2)) a2.color(p2 + 1, C.green);
        a2.end_animate();
        await sd.pause();
        p2++;
    }
}
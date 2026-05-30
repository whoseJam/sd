import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C =  sd.color();
const boxes = [];

const data = `
wbwww
bwwbw
wwbww
wwwwb
wwwbw
`
const mp = I.readCharMatrix(data, 5, 5);

sd.init(() => {
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            const box = new sd.Box(svg);
            box.i = i;
            box.j = j;
            if (mp[i][j] == "b")
                box.color(C.grey);
            boxes.push(box);
        }
    }
    update();
})

sd.main(async () => {
    await sd.pause();
    startAnimate();
    reorder({
        1: 2,
        2: 1,
        3: 3,
        4: 5,
        5: 4
    });
    update();
    endAnimate();
    await sd.pause();
})

function reorder(mp) {
    boxes.forEach(box => {
        box.i = mp[box.i];
    })
}

function startAnimate() {
    boxes.forEach(box => {
        box.startAnimate();
    })
}

function endAnimate() {
    boxes.forEach(box => {
        box.endAnimate();
    })
}

function update() {
    boxes.forEach(box => {
        const i = box.i;
        const j = box.j;
        box.x((i-1) * 40)
            .y((j-1) * 40);
    });
}
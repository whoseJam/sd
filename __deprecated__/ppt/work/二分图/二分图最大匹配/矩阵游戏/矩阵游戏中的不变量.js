import * as sd from "@/sd";

const svg = sd.svg();
const boxes = [];

sd.init(() => {
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            const box = new sd.Box(svg);
            box.i = i;
            box.j = j;
            if (i == 4) {
                if (j == 2) box.value("a");
                if (j == 4) box.value("b");
            }
            boxes.push(box);
        }
    }
    update();
})

sd.main(async () => {
    await sd.pause();
    startAnimate();
    swapRow(2, 4);
    update();
    endAnimate();
    await sd.pause();
    startAnimate();
    swapCol(2, 4);
    update();
    endAnimate();
    await sd.pause();
    startAnimate();
    swapRow(2, 4);
    update();
    endAnimate();
})

function swapRow(ri, rj) {
    const rowi = boxes.filter(box => box.i === ri);
    const rowj = boxes.filter(box => box.i === rj);
    for (let k = 0; k < 5; k++) {
        rowi[k].i = rj;
        rowj[k].i = ri;
    }
}

function swapCol(ci, cj) {
    const coli = boxes.filter(box => box.j === ci);
    const colj = boxes.filter(box => box.j === cj);
    for (let k = 0; k < 5; k++) {
        coli[k].j = cj;
        colj[k].j = ci;
    }
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
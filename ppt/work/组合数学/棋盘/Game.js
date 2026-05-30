import * as sd from "@/sd";

export function CreateGame(data) {
    const svg = sd.svg();
    const D = sd.device();
    const arr = new sd.Array(svg);
    let direction = "right";

    D.onKeyDown("a", () => direction = "left");
    D.onKeyDown("d", () => direction = "right");

    sd.init(() => {
        console.log("data=", data);
        data.forEach(value => {
            if (value) arr.push(value);
            else arr.push();
        });
        arr.forEachElement((element, id) => {
            element.onClick(() => {
                if (!element.value()) return;
                sd.inter(async () => {
                    if (direction === "right") {
                        if (canMoveRight(id)) await moveRight(id);
                        else if (canMoveLeft(id)) await moveLeft(id);
                    } else if (direction === "left") {
                        if (canMoveLeft(id)) await moveLeft(id);
                        else if (canMoveRight(id)) await moveRight(id);
                    }
                });
            });
        });
    })

    sd.main(async () => {
        
    })

    function canMoveRight(i) {
        if (i + 2 >= arr.length()) return false;
        if (!arr.value(i + 1)) return false;
        if (arr.value(i + 2)) return false;
        return true;
    }

    function canMoveLeft(i) {
        if (i - 2 < 0) return false;
        if (!arr.value(i - 1)) return false;
        if (arr.value(i - 2)) return false;
        return true;
    }

    async function moveRight(i) {
        const t = arr.element(i).drop();
        arr.startAnimate();
        arr.element(i + 2).valueFromExist(t);
        arr.endAnimate();
    }

    async function moveLeft(i) {
        const t = arr.element(i).drop();
        arr.startAnimate();
        arr.element(i - 2).valueFromExist(t);
        arr.endAnimate();
    }
}

console.log("Game !!!!!!!");
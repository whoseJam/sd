import * as sd from "@/sd";
import { StonePile } from "./StonePile";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [3, 5, 6];
const stones = new sd.ValueArray(svg).align("my").elementWidth(80);

sd.init(() => {
    data.forEach(count => {
        const pile = new StonePile(stones, count);
        stones.push(pile);
        pile.forEachElement(stone => {
            stone.onClick(() => {
                sd.inter(async () => {
                    const index = pile.indexOf(stone);
                    pile.startAnimate().erase(index).endAnimate();
                });
            });
        });
    });
});

sd.main(async () => {});

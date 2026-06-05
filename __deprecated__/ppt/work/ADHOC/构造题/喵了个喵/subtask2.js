import * as sd from "@/sd";
import { Game } from "./Game";

const svg = sd.svg();
const C = sd.color();
const game = new Game(svg, 3, [1, 2, 3, 4, 5, 1, 3, 5, 2, 4], 5, [C.blue, C.green, C.red, C.yellow, C.orange]);

sd.init(() => {
    game.moveTo(1).moveTo(1);
    game.moveTo(2).moveTo(2);
});

sd.main(async () => {});

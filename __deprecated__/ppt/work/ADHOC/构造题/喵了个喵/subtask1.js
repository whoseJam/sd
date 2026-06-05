import * as sd from "@/sd";
import { Game } from "./Game";

const svg = sd.svg();
const C = sd.color();
const game = new Game(svg, 3, [1, 2, 3, 4, 2, 3, 4, 1], 4, [C.blue, C.green, C.red, C.yellow]);

sd.init(() => {});

sd.main(async () => {});

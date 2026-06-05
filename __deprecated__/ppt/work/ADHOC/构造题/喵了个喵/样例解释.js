import * as sd from "@/sd";
import { Game } from "./Game";

const svg = sd.svg();
const C = sd.color();
const game = new Game(svg, 5, 10, 4, [C.blue, C.green, C.red, C.yellow]);

sd.init(() => {});

sd.main(async () => {});

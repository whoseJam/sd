import * as sd from "@/sd";
import { CreateGame } from "./Game";

const I = sd.input();
const data = I.readIntArray("1 0 0 1 1 0 1 0 1 1 0 0 0", 13, false);

CreateGame(data)
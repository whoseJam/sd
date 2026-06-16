import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const template = path.join(here, "template.html");
export const entry = path.join(here, "deck.ts");
export const libraryBundle = "./dist/impress.js";

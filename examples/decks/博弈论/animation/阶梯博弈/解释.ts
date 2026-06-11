import * as sd from "@/sd";

import { Stairs } from "../common/stairs";

const svg = sd.svg();

const stairs = new Stairs({
  targetNode: svg,
  counts: [0, 1, 2, 2, 1],
});

sd.main(async () => {
  stairs.fadeIn();
  await sd.pause();
});

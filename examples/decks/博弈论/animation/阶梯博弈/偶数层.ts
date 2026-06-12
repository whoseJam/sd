import * as sd from "@/sd";

import { Stairs } from "../common/stairs";

const svg = sd.svg();

const stairs = new Stairs({
  targetNode: svg,
  counts: [0, 0, 3, 0, 2],
});

sd.main(async () => {
  stairs.fadeIn();
  await sd.pause();
});

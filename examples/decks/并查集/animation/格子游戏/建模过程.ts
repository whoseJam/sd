import * as sd from "@/sd";

// Same lattice with each intersection numbered. Highlights the
// "vertex = DSU element" view that makes edge-cycle detection
// equivalent to "same-set check before merging".

const svg = sd.svg();
const C = sd.color();

const N = 4;
const SIZE = 60;
const X0 = -((N - 1) * SIZE) / 2;
const Y0 = -((N - 1) * SIZE) / 2;
const R = 13;

for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    const x = X0 + j * SIZE;
    const y = Y0 + i * SIZE;
    new sd.Circle({
      targetNode: svg,
      cx: x,
      cy: y,
      r: R,
      fill: C.white,
      stroke: C.darkButtonGrey,
      strokeWidth: 1.2,
    });
    new sd.Text({
      targetNode: svg,
      text: String(i * N + j + 1),
      cx: x,
      cy: y,
      fontSize: 11,
      fill: C.darkButtonGrey,
    });
  }
}

sd.main(async () => {
  await sd.pause();
});

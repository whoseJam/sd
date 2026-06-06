import * as sd from "@/sd";

// Probe: when setText changes length, the fading-in / fading-out chars are
// rendered via fadePath() in text-engine/transform.ts which only pushes an
// opacity action — no fill action. Hypothesis: those chars render with the
// SVG default fill (black) regardless of the Text's fill attribute.
//
// Use a long duration so we can park playwright mid-morph.

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

let emptyToFull: sd.Text;
let fullToEmpty: sd.Text;
let spaceToChar: sd.Text;

sd.init(() => {
  emptyToFull = new sd.Text({
    targetNode: svg,
    text: "",
    cx: 0,
    cy: 80,
    fontSize: 48,
    fill: C.red,
  });
  fullToEmpty = new sd.Text({
    targetNode: svg,
    text: "ABC",
    cx: 0,
    cy: 0,
    fontSize: 48,
    fill: C.mediumSeaGreen,
  });
  spaceToChar = new sd.Text({
    targetNode: svg,
    text: "A  C",
    cx: 0,
    cy: -80,
    fontSize: 48,
    fill: C.steelBlue,
  });
});

sd.main(async () => {
  await sd.pause();
  // Three morphs that all force the fadePath() branch:
  //   emptyToFull: "" → "RED"     all 3 chars fade in (sourceIndex undefined)
  //   fullToEmpty: "ABC" → ""     all 3 chars fade out (targetIndex undefined)
  //   spaceToChar: "A  C" → "ABBC" the two interior spaces (undefined source
  //                                paths) become B's (defined target paths)
  emptyToFull
    .startAnimate({ duration: 4000, easing: E.linear })
    .setText("RED")
    .endAnimate();
  fullToEmpty
    .startAnimate({ duration: 4000, easing: E.linear })
    .setText("")
    .endAnimate();
  spaceToChar
    .startAnimate({ duration: 4000, easing: E.linear })
    .setText("ABBC")
    .endAnimate();
  await sd.pause();
});

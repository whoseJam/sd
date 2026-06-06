import * as sd from "@/sd";

// Two side-by-side ∑s show what changes (top: i is bound and varies the
// argument of F) vs what doesn't (bottom: F(i) sees the loop variable
// "i" as a free name, so it's a constant in the sum).

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

const top = new sd.Math({
  targetNode: svg,
  text: "\\sum_{i=1}^3 i F(i)",
  cx: 0,
  cy: 0,
  fontSize: 30,
  fill: C.darkButtonGrey,
});
const bottom = new sd.Math({
  targetNode: svg,
  text: "F(i) \\sum_{i=1}^3 i",
  cx: 0,
  cy: -80,
  fontSize: 30,
  fill: C.darkButtonGrey,
});

const DUR = 500;

sd.main(async () => {
  await sd.pause();
  top
    .startAnimate({ duration: DUR, easing: E.easeInOut })
    .setText("1 F(1) + 2 F(2) + 3 F(3)")
    .endAnimate();
  await sd.pause();
  bottom
    .startAnimate({ duration: DUR, easing: E.easeInOut })
    .setText("F(i) (1 + 2 + 3)")
    .endAnimate();
  await sd.pause();
});

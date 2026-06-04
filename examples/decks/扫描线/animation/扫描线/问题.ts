import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

// Intro visual for the "问题" slide: three overlapping axis-aligned
// rectangles → collapse to one silhouette + "= ?". The whole pitch of
// the deck ("compute the area of a union of rectangles") in two beats,
// no formulas.

const UNIT = 36;
const UNION_FILL = "#7fb8d6";

const data = [
  { x: -7, y: -2, w: 5, h: 4, fill: "#a8c8f0" },
  { x: -3, y: -3, w: 4, h: 3, fill: "#f3a87f" },
  { x: 0, y: -1, w: 5, h: 4, fill: "#9fd3a8" },
];

const rects: sd.Rect[] = [];
let questionText: sd.Text;

sd.init(() => {
  data.forEach(({ x, y, w, h, fill }) => {
    rects.push(
      new sd.Rect({
        targetNode: svg,
        x: x * UNIT,
        y: y * UNIT,
        width: w * UNIT,
        height: h * UNIT,
        fill,
        fillOpacity: 0.55,
        stroke: C.darkGray,
        strokeWidth: 1.2,
        opacity: 0,
      }),
    );
  });

  questionText = new sd.Text({
    targetNode: svg,
    text: "= ?",
    cx: 7.5 * UNIT,
    cy: 0,
    fontSize: 40,
    fill: C.darkButtonGrey,
    opacity: 0,
  });
});

sd.main(async () => {
  // Beat 1: rectangles fade in one-by-one. Distinct fills + 0.55 alpha
  // so overlap regions visibly darken — the viewer registers "they're
  // separate shapes that overlap" before the merge.
  for (let i = 0; i < rects.length; i++) {
    rects[i]
      .startAnimate({ delay: i * 220, duration: 380, easing: E.easeOut })
      .setOpacity(1)
      .endAnimate();
  }
  await sd.pause();

  // Beat 2: repaint all three with the same opaque fill — the merged
  // silhouette IS the union, no need to compute the polygon. "= ?"
  // appears beside it to pose the question the rest of the deck answers.
  for (let i = 0; i < rects.length; i++) {
    rects[i]
      .startAnimate({ delay: i * 80, duration: 520, easing: E.easeInOut })
      .setFill(UNION_FILL)
      .setFillOpacity(1)
      .setStroke(C.none)
      .endAnimate();
  }
  questionText
    .startAnimate({ delay: 380, duration: 320, easing: E.easeOut })
    .setOpacity(1)
    .endAnimate();
  await sd.pause();
});

import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const E = sd.easing();

type Row = {
  label: string;
  initial: string;
  steps: string[];
};

const rows: Row[] = [
  { label: "(a) same width, last digit",  initial: "Σ area  0",  steps: ["Σ area  1", "Σ area  2", "Σ area  9"] },
  { label: "(b) width grows by 1 char",   initial: "Σ area  9",  steps: ["Σ area  10", "Σ area  19", "Σ area  36"] },
  { label: "(c) digits only",             initial: "0",          steps: ["1", "2", "10", "19", "36"] },
  { label: "(d) prefix stable, num grow", initial: "n = 0",      steps: ["n = 7", "n = 36"] },
  { label: "(e) ASCII only baseline",     initial: "S area  0",  steps: ["S area  1", "S area  19"] },
];

const X0 = 0;
const ROW_GAP = 60;
const LABEL_W = 260;
const TEXT_X = X0 + LABEL_W;

const texts: sd.Text[] = [];

sd.init(() => {
  for (let i = 0; i < rows.length; i++) {
    const y = i * ROW_GAP;
    new sd.Text({
      targetNode: svg,
      text: rows[i].label,
      cx: X0,
      cy: y,
      fontSize: 14,
      fill: C.darkGrey,
    });
    texts.push(
      new sd.Text({
        targetNode: svg,
        text: rows[i].initial,
        cx: TEXT_X,
        cy: y,
        fontSize: 22,
        fill: C.darkGreen,
        }),
    );
    // Anchor reference: a small fixed dot at the same (cx, cy) so we
    // can SEE whether the text drifts away from its declared anchor
    // during the morph.
    new sd.Circle({
      targetNode: svg,
      cx: TEXT_X,
      cy: y,
      r: 2,
      fill: C.red,
    });
  }
});

sd.main(async () => {
  await sd.pause();
  const maxSteps = Math.max(...rows.map((r) => r.steps.length));
  for (let s = 0; s < maxSteps; s++) {
    for (let i = 0; i < rows.length; i++) {
      const next = rows[i].steps[s];
      if (next === undefined) continue;
      texts[i]
        .startAnimate({ duration: 3000, easing: E.easeInOut })
        .setText(next)
        .endAnimate();
    }
    await sd.pause();
  }
});

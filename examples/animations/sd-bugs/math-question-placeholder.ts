import * as sd from "@/sd";

// Bug 1 repro: Math.setText with "?" as a placeholder fails on the
// second morph with "Subtext not found: ?".
//
// Step A (works): "\sum_{?}^??" -> "\sum_{i=1}^??" with {"?": "i=1"}.
// Step B (throws): "\sum_{i=1}^??" -> "\sum_{i=1}^n?" with {"?": "n"}.
//
// The source for step B is the Math's attributes.text after step A —
// which still contains literal "?" characters at the LaTeX level, but
// the parsed-glyph stream that mapping searches against may not.

const svg = sd.svg();
const C = sd.color();

const m = new sd.Math({
  targetNode: svg,
  text: "\\sum_{?}^??",
  cx: 0,
  cy: 0,
  fontSize: 30,
  fill: C.darkButtonGrey,
});

sd.main(async () => {
  await sd.pause();
  // Probe: what does attributes.text look like at this point?
  console.log("[probe A] string:", m.getText());
  console.log("[probe A] text glyphs:", JSON.stringify(m.text));

  m.startAnimate({ duration: 300 }).setText("\\sum_{i=1}^??", { "?": "i=1" }).endAnimate();
  await sd.pause();

  console.log("[probe B] string:", m.getText());
  console.log("[probe B] text glyphs:", JSON.stringify(m.text));

  m.startAnimate({ duration: 300 }).setText("\\sum_{i=1}^n?", { "?": "n" }).endAnimate();
  await sd.pause();
});

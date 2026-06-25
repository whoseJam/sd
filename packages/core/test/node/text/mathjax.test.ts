import { describe, expect, it } from "vitest";

import { MathManager } from "@/node/text/text-engine/mathjax";

const SVG_NS = "http://www.w3.org/2000/svg";

type Geom = {
  viewBox: [number, number, number, number];
  svgX: number;
  svgY: number;
  svgW: number;
  svgH: number;
};

// Builds a synthetic MathJax-shaped <svg> with one <use> at the root g's
// origin (no extra transform). `getMathPaths` walks
//   svg
//     children[0] = <defs>
//     children[1] = <g> (root)
// so the structure mirrors what real MathJax output looks like at the level
// of detail this test cares about. Real MathJax output is driven by a global
// `MathJax.tex2svg(...)` we can't run in happy-dom, so we stand in for it.
function buildSyntheticMath(geom: Geom) {
  const svg = document.createElementNS(SVG_NS, "svg") as SVGSVGElement;
  svg.setAttribute("viewBox", geom.viewBox.join(" "));
  svg.setAttribute("x", String(geom.svgX));
  svg.setAttribute("y", String(geom.svgY));
  svg.setAttribute("width", String(geom.svgW));
  svg.setAttribute("height", String(geom.svgH));

  const defs = document.createElementNS(SVG_NS, "defs");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("id", "P0");
  path.setAttribute("d", "M0 0Z");
  path.setAttribute("data-c", "P0");
  defs.appendChild(path);

  const root = document.createElementNS(SVG_NS, "g") as SVGGElement;
  const use = document.createElementNS(SVG_NS, "use") as SVGUseElement;
  use.setAttribute("xlink:href", "#P0");
  use.setAttribute("data-c", "P0");
  root.appendChild(use);

  svg.appendChild(defs);
  svg.appendChild(root);

  document.body.appendChild(svg);

  return { element: () => svg, __append: () => {}, __remove: () => {} } as any;
}

// Where the browser actually renders the point (contentX, contentY) given
// `preserveAspectRatio="xMidYMid meet"` (the SVG default - no manual override
// applied anywhere in MathManager).
function browserScreenPoint(geom: Geom, contentX: number, contentY: number) {
  const [vx, vy, vw, vh] = geom.viewBox;
  const scale = Math.min(geom.svgW / vw, geom.svgH / vh);
  const xPad = (geom.svgW - vw * scale) / 2;
  const yPad = (geom.svgH - vh * scale) / 2;
  return {
    x: geom.svgX + xPad + (contentX - vx) * scale,
    y: geom.svgY + yPad + (contentY - vy) * scale,
  };
}

function assertMorphMatchesBrowser(
  geom: Geom,
  contentX: number,
  contentY: number,
) {
  const fakeMath = buildSyntheticMath(geom);
  const paths = MathManager.getMathPaths(fakeMath);
  expect(paths).toHaveLength(1);
  // <use> carries no transform of its own, so the matrix arriving at the
  // <use> equals initialMatrix - mapping content coords directly to the
  // parent's user-units screen position.
  const morph = (paths[0].transform as DOMMatrix).transformPoint({
    x: contentX,
    y: contentY,
  });
  const browser = browserScreenPoint(geom, contentX, contentY);
  expect(morph.x).toBeCloseTo(browser.x, 6);
  expect(morph.y).toBeCloseTo(browser.y, 6);
}

describe("MathManager.getMathPaths (initialMatrix)", () => {
  // Height-limited viewport: svgH/vh < svgW/vw → uniform scale = svgH/vh,
  // x padding > 0, y padding = 0. The previous formula skipped x padding
  // entirely, leaving morph paths offset by xPad in screen x.
  it("matches xMidYMid-meet for tall-and-thin content (xPad > 0)", () => {
    assertMorphMatchesBrowser(
      {
        viewBox: [0, -1000, 100, 1500],
        svgX: 0,
        svgY: 0,
        svgW: 10,
        svgH: 30,
      },
      0,
      -1000,
    );
  });

  // Width-limited viewport: svgW/vw < svgH/vh → uniform scale = svgW/vw,
  // x padding = 0, y padding > 0. Mirror of the case above on the y axis.
  it("matches xMidYMid-meet for short-and-wide content (yPad > 0)", () => {
    assertMorphMatchesBrowser(
      {
        viewBox: [0, -683, 100, 100],
        svgX: 5,
        svgY: 7,
        svgW: 20,
        svgH: 30,
      },
      0,
      -683,
    );
  });

  // The viewBox is larger than the actual rendered content - common for
  // MathJax glyphs that don't fill the full em-box. The morph path matrix
  // must still anchor at the viewBox origin, not at where inner content
  // happens to start. This is the configuration that produced the ~7.5px
  // on-screen y jitter when morph paths swapped in for <use> elements.
  it("matches xMidYMid-meet when inner content does not fill viewBox", () => {
    assertMorphMatchesBrowser(
      {
        viewBox: [0, -1000, 100, 1500],
        svgX: 0,
        svgY: 0,
        svgW: 100,
        svgH: 1500,
      },
      0,
      0,
    );
  });
});

import { Window } from "@/Animate/Window";
import type { SDBox } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Group } from "@/Node/Other/Group";

/**
 * Gets the svg canvas.
 *
 * The canvas spans the entire screen, and its internal content is automatically
 * centered both horizontally and vertically.
 * @example
 * const svg = sd.svg();
 * const rect = new sd.Rect(svg);
 * const circle = new sd.Circle(svg);
 */
export function svg(): Group {
  return Root.group;
}

export class Root {
  static svg: RenderNode;
  static group: Group;
  static viewBox: SDBox;
  static init() {
    // Math coordinates: (0, 0) is the canvas center, y grows upward.
    this.viewBox = { x: -600, y: -300, width: 1200, height: 600 };

    if (true) {
      const body = RenderNode.getDocumentBodyRenderNode();
      body.setAttribute("width", "100%");
      body.setAttribute("height", "100%");
      body.setAttribute("position", "absolute");
      this.svg = RenderNode.createRenderNodeWithoutAction(
        undefined,
        body,
        "svg",
      );
      this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      this.svg.setAttribute("width", "100%");
      this.svg.setAttribute("height", "100%");
    }
    if (window.self === window.top) {
      updateSVGViewBox(this.viewBox);
      updateWindowRate(this.viewBox);
      this.svg.setAttribute("opacity", 1);
    } else this.svg.setAttribute("opacity", 0);
    this.group = new Group();
    this.svg.appendChild(this.group.getRootRenderNode());
  }

  static setViewBox(
    x: number,
    y: number,
    width: number,
    height: number,
    rate: number,
  ) {
    /*
            |-----------W-----------|
            X           cX          mX
        Y   +-----------+-----------+  -
            |   x       cx      mx  |  |
            |   +-------+-------+   |  |
            |   |       |       |   |  |
            |   |       |       |   |  |
        cY  |   +-------+-------+   +  H
            |   |       |       |   |  |
            |   |       |       |   |  |
            |   +-------+-------+   |  |
            |                       |  |
        mY  +-----------+-----------+  -
        
        */
    const cx = x + width / 2;
    const cy = y + height / 2;
    const mx = x + width;
    const my = y + height;
    const X = x + ((x - cx) * (rate - 1)) / 2;
    const Y = y + ((y - cy) * (rate - 1)) / 2;
    if (isNaN(X) || isNaN(Y)) return;
    const mX = mx + ((mx - cx) * (rate - 1)) / 2;
    const mY = my + ((my - cy) * (rate - 1)) / 2;
    const W = mX > X ? mX - X : 1200;
    const H = mY > Y ? my - Y : 600;
    this.viewBox = { x: X, y: Y - 1, width: W, height: H + 2 };
    updateSVGViewBox(this.viewBox);
    updateWindowRate(this.viewBox);
    this.svg.setAttribute("opacity", 1);
  }
}

// box is math (bottom-left anchored, y grows up). SVG viewBox uses top-left
// with y growing down, so the y coordinate flips: svg_y = -(math_y + height).
function updateSVGViewBox(box: SDBox) {
  const view = Root.svg;
  view.setAttribute(
    "viewBox",
    `${box.x} ${-(box.y + box.height)} ${box.width} ${box.height}`,
  );
}

function updateWindowRate(box: SDBox) {
  const view = Root.svg;
  const width = view.element().getBoundingClientRect().width;
  const height = view.element().getBoundingClientRect().height;
  if (width / box.width > height / box.height)
    Window.RATE = height / box.height;
  else Window.RATE = width / box.width;
}

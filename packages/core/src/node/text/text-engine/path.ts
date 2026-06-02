import type { BaseText } from "@/node/text/base-text";

import { Animate as A } from "@/animate/animate";
import { Math } from "@/node/text/math";
import { Text } from "@/node/text/text";
import { MathManager } from "@/node/text/text-engine/mathjax";
import { FontManager } from "@/node/text/text-engine/opentype";
import { PathView } from "@/node/text/text-engine/text-view";

export function getPaths(text: BaseText, t: number): Array<PathView> {
  if (text instanceof Text) return getTextPaths(text, t);
  if (text instanceof Math) return getMathPaths(text, t);
}

export function getTextPaths(text: Text, t: number): Array<PathView> {
  const content = A.getAttribute(text, "text", t, text.getText());
  const family = A.getAttribute(text, "fontFamily", t, text.getFontFamily());
  const size = A.getAttribute(text, "fontSize", t, text.getFontSize());
  const x = A.getAttribute(text, "x", t, text.getLocalX());
  const y = A.getAttribute(text, "y", t, text.getLocalY());
  const paths = FontManager.getTextPathsFromOpenType(
    content,
    family,
    size,
    x,
    y,
  );
  return paths.map((path) => {
    const data = path.toPathData(4);
    if (data === "") return undefined;
    return new PathView(data);
  });
}

function getMathPaths(text: Math, t: number): Array<PathView> {
  const html = A.getAttribute(text, "html", t, text.attributes.html);
  const size = A.getAttribute(text, "fontSize", t, text.getFontSize());
  const x = A.getAttribute(text, "x", t, text.getLocalX());
  const y = A.getAttribute(text, "y", t, text.getLocalY());
  // BaseText.renderAttribute("y", ...) would flip using
  // this.getLocalHeight() = this.height, which after Math.setText is
  // already the TARGET height — applied to the source html that gives
  // a wrong DOM y and renders source paths top-aligned to the target's
  // frame. Compute height from THIS html's own bbox instead.
  // MathManager.boundingBox's formula assumes html's DOM y equals its
  // math y (unflipped); temporarily reset before the query, then write
  // the correctly-flipped DOM y back.
  html.setAttribute("font-size", size);
  html.setAttribute("x", x);
  html.setAttribute("y", y);
  const ownHeight = MathManager.boundingBox(y, html).height;
  html.setAttribute("y", -(y + ownHeight));
  const paths = MathManager.getMathPaths(+html.getAttribute("y"), html);
  return paths;
}

export function getTextPaths2(
  text: Text,
  t: number,
  string: string,
): Array<PathView> {
  const family = A.getAttribute(text, "fontFamily", t, text.getFontFamily());
  const size = A.getAttribute(text, "fontSize", t, text.getFontSize());
  const x = A.getAttribute(text, "x", t, text.getLocalX());
  const y = A.getAttribute(text, "y", t, text.getLocalY());
  const paths = FontManager.getTextPathsFromOpenType(
    string,
    family,
    size,
    x,
    y,
  );
  return paths.map((path) => {
    const data = path.toPathData(4);
    if (data === "") return undefined;
    return new PathView(data);
  });
}

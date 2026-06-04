import { Window } from "@/animate/window";
import { Device } from "@/interact/device";
import { Root } from "@/interact/root";
import { Status } from "@/interact/status";
import { PathEngine } from "@/node/path/path-engine";
import { PolygonEngine } from "@/node/shape/polygon-engine";
import { MathManager } from "@/node/text/text-engine/mathjax";
import { FontManager } from "@/node/text/text-engine/opentype";

function setupButtonStyles() {
  const css = `button:active { box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }`;
  const styleSheet = new CSSStyleSheet();
  styleSheet.insertRule(css, 0);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
}

export function init() {
  setupButtonStyles();
  Root.init();
  Window.init();
  Device.init();
  Status.init();
  FontManager.init();
  MathManager.init();
  PathEngine.init();
  PolygonEngine.init();
}

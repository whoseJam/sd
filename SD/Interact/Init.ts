import { createWaterMark } from "@/Animate/Animate";
import { Window } from "@/Animate/Window";
import { Device } from "@/Interact/Device";
import { Root } from "@/Interact/Root";
import { Status } from "@/Interact/Status";
import { PathEngine } from "@/Node/Path/PathEngine";
import { PolygonEngine } from "@/Node/Shape/PolygonEngine";
import { MathManager } from "@/Node/Text/TextEngine/Mathjax";
import { FontManager } from "@/Node/Text/TextEngine/Opentype";

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
    createWaterMark();
}

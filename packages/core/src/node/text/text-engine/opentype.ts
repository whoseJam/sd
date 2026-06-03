import opentype from "opentype.js";

import type { Text } from "@/node/text/text";

import { fontWhitelist, sdBase } from "@/interact/config";
import { Root } from "@/interact/root";
import { RenderNode } from "@/renderer/render-node";

export class FontManager {
  private static textSVG: RenderNode;
  private static fonts: Record<string, opentype.Font> = {};
  private static loadAllPromise: Promise<void> | null = null;

  static init() {
    // Register each whitelisted family with the browser's CSS font resolver,
    // pointing at the TTFs shipped under vendor/fonts/. This keeps SVG <text>
    // rendering identical across browsers / headless — the browser no longer
    // falls back to whatever the host system happens to call "Arial".
    const style = document.createElement("style");
    style.textContent = fontWhitelist
      .map((family) => {
        const url = `${sdBase}/vendor/fonts/${encodeURIComponent(family)}.ttf`;
        return `@font-face { font-family: ${JSON.stringify(family)}; src: url(${JSON.stringify(url)}) format("truetype"); }`;
      })
      .join("\n");
    document.head.appendChild(style);

    this.textSVG = RenderNode.createRenderNodeWithoutAction(
      undefined,
      Root.svg,
      "text",
    );
    this.textSVG.setAttribute("opacity", 0);
  }

  static loadAll(): Promise<void> {
    if (!this.loadAllPromise) {
      this.loadAllPromise = this.doLoadAll();
    }
    return this.loadAllPromise;
  }

  private static async doLoadAll(): Promise<void> {
    await Promise.all(
      fontWhitelist.map(async (family) => {
        const url = `${sdBase}/vendor/fonts/${encodeURIComponent(family)}.ttf`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(
            `Font ${family} not found at ${url} (HTTP ${res.status}). Add packages/assets/fonts/${family}.ttf or remove ${family} from data-fonts.`,
          );
        }
        const buf = await res.arrayBuffer();
        this.fonts[family] = opentype.parse(buf);
      }),
    );
  }

  static fontExists(family: string) {
    return this.fonts[family] !== undefined;
  }

  static boundingBox(input: Text | string, family?: string, size?: number) {
    const text = typeof input === "string" ? input : input.getText();
    const fontFamily =
      typeof input === "string" ? family : input.getFontFamily();
    const fontSize = typeof input === "string" ? size : input.getFontSize();
    function includeChinese(str: string) {
      return /[一-龥]/.test(str);
    }
    if (!this.fonts[fontFamily] || includeChinese(text)) {
      this.textSVG.setAttribute("text", text);
      this.textSVG.setAttribute("font-size", fontSize);
      this.textSVG.setAttribute("font-family", fontFamily);
      return this.textSVG.elementAs<SVGTextElement>().getBBox();
    }
    const font = this.fonts[fontFamily];
    const ascender = font.ascender;
    const descender = font.descender;
    const scale = fontSize / font.unitsPerEm;
    const height = (ascender - descender) * scale;
    const width = getTextWidth(this.fonts[fontFamily], text, fontSize);
    return { width, height };
  }

  static getTextPathsFromOpenType(
    text: string,
    family: string,
    size: number,
    x: number,
    y: number,
  ): Array<opentype.Path> {
    const font = this.fonts[family];
    if (!font) {
      throw new Error(
        `Font ${family} not loaded. Add it to data-fonts and ship packages/assets/fonts/${family}.ttf.`,
      );
    }
    const ascender = font.ascender;
    const descender = font.descender;
    const scale = size / font.unitsPerEm;
    const height = (ascender + descender) * scale;
    const offset = -descender * scale;
    return Array.from(font.getPaths(text, x, y + height + offset, size));
  }

  static widthToFontSize(text: string, family: string, width: number) {
    const box = this.boundingBox(text, family, 20);
    return (width / box.width) * 20;
  }

  static heightToFontSize(text: string, family: string, height: number) {
    const box = this.boundingBox(text, family, 20);
    return (height / box.height) * 20;
  }
}

function getTextWidth(font: opentype.Font, text: string, size: number) {
  let width = 0;
  const glyphs = font.stringToGlyphs(text);
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    width += glyph.advanceWidth * (size / font.unitsPerEm);
    if (i < glyphs.length - 1) {
      const kerning = font.getKerningValue(glyph, glyphs[i + 1]);
      width += kerning * (size / font.unitsPerEm);
    }
  }
  return width;
}

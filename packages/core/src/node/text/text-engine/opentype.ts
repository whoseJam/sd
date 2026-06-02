import opentype from "opentype.js";

import type { Text } from "@/node/text/text";

import { fontWhitelist } from "@/interact/config";
import { Root } from "@/interact/root";
import { RenderNode } from "@/renderer/render-node";

interface FontData {
  family: string;
  blob(): Promise<Blob>;
}

declare global {
  interface Window {
    queryLocalFonts?: () => Promise<FontData[]>;
  }
}

export class FontManager {
  private static textSVG: RenderNode;
  private static fonts: Record<string, opentype.Font> = {};
  private static localFontsPromise: Promise<FontData[]> | null = null;
  private static loadAllPromise: Promise<void> | null = null;

  static init() {
    if (window.queryLocalFonts) {
      this.localFontsPromise = window.queryLocalFonts().catch(() => []);
    }
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
    if (!this.localFontsPromise) return;
    const all = await this.localFontsPromise;
    await Promise.all(
      fontWhitelist.map((family) => {
        if (this.fonts[family]) return;
        const match = all.find((f) => f.family === family);
        if (!match) return;
        return match
          .blob()
          .then((b) => b.arrayBuffer())
          .then((buf) => {
            this.fonts[family] = opentype.parse(buf);
          });
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
      return /[\u4e00-\u9fa5]/.test(str);
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

import opentype from "opentype.js";

import type { Text } from "@/Node/Text/Text";

import { Root } from "@/Interact/Root";
import { RenderNode } from "@/Renderer/RenderNode";

export class FontManager {
  private static textSVG: RenderNode;
  private static fonts: Record<string, opentype.Font> = {};

  static init() {
    this.load("Consolas");
    this.load("Times New Roman");
    this.load("Arial");
    this.textSVG = RenderNode.createRenderNodeWithoutAction(
      undefined,
      Root.svg,
      "text",
    );
    this.textSVG.setAttribute("opacity", 0);
  }

  private static load(family: string) {
    const base =
      typeof window !== "undefined"
        ? (window as any).__SD_FONTS_URL__
        : undefined;
    if (!base) return;
    const url = `${base}/${family}.ttf`;
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        this.fonts[family] = opentype.parse(buffer);
      })
      .catch(() => {
        /* network failure is silent; the font just won't be available */
      });
  }

  static fontExists(family: string) {
    return this.fonts[family] !== undefined;
  }

  static boundingBox(text: Text | string, family?: string, size?: number) {
    const text_ = typeof text === "string" ? text : text.getText();
    const family_ = typeof text === "string" ? family : text.getFontFamily();
    const size_ = typeof text === "string" ? size : text.getFontSize();
    function includeChinese(str: string) {
      return /[\u4e00-\u9fa5]/.test(str);
    }
    if (!this.fonts[family_] || includeChinese(text_)) {
      this.textSVG.setAttribute("text", text_);
      this.textSVG.setAttribute("font-size", size_);
      this.textSVG.setAttribute("font-family", family_);
      return this.textSVG.elementAs<SVGTextElement>().getBBox();
    }
    const font = this.fonts[family_];
    const ascender = font.ascender;
    const descender = font.descender;
    const scale = size_ / font.unitsPerEm;
    const height = (ascender - descender) * scale; // when getting text height, use ascender - descender
    const width = getTextWidth(this.fonts[family_], text_, size_);
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
    const height = (ascender + descender) * scale; // when getting text path, use ascender + descender
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

import { rand } from "@/utility/random";

export type SDRGBColor = {
  r: number;
  g: number;
  b: number;
};
export type SDRGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};
export type SDHEXColor = `#${string}`;
export type SDLiteralColor =
  | "none"
  | "transparent"
  | "black"
  | "red"
  | "blue"
  | "cyan"
  | "gray"
  | "silver"
  | "olive"
  | "teal"
  | "white"
  | "green"
  | "yellow"
  | "magenta"
  | "grey"
  | "maroon"
  | "purple"
  | "navy";
export type SDColor = SDRGBColor | SDHEXColor | SDRGBAColor | SDLiteralColor;
export type SDPacketColor = {
  fill: SDColor;
  stroke: SDColor;
};
export type SDAllColor = SDColor | SDPacketColor;

export class Color {
  static none: SDLiteralColor = "none";
  static transparent: SDLiteralColor = "transparent";

  // Basic colors
  static red: SDHEXColor = "#f14c4c";
  static blue: SDHEXColor = "#4a90e2";
  static cyan: SDHEXColor = "#00ffff";
  static grey: SDHEXColor = "#999999";
  static gray: SDHEXColor = "#999999";
  static pink: SDHEXColor = "#ff69b4";
  static snow: SDHEXColor = "#fffafa";
  static azure: SDHEXColor = "#f0ffff";
  static black: SDHEXColor = "#000000";
  static brown: SDHEXColor = "#8b4726";
  static coral: SDHEXColor = "#ff7256";
  static green: SDHEXColor = "#92d050";
  static white: SDHEXColor = "#ffffff";
  static orange: SDHEXColor = "#f58617";
  static purple: SDHEXColor = "#da70d6";
  static violet: SDHEXColor = "#ee82ee";
  static yellow: SDHEXColor = "#ffff4d";
  static indigo: SDHEXColor = "#4b0082";
  static lime: SDHEXColor = "#00ff00";
  static teal: SDHEXColor = "#008080";
  static navy: SDHEXColor = "#000080";
  static maroon: SDHEXColor = "#800000";
  static olive: SDHEXColor = "#808000";
  static silver: SDHEXColor = "#c0c0c0";
  static gold: SDHEXColor = "#ffd700";
  static beige: SDHEXColor = "#f5f5dc";
  static ivory: SDHEXColor = "#fffff0";
  static khaki: SDHEXColor = "#f0e68c";
  static lavender: SDHEXColor = "#e6e6fa";
  static magenta: SDHEXColor = "#ff00ff";
  static mint: SDHEXColor = "#98ff98";
  static peach: SDHEXColor = "#ffdab9";
  static plum: SDHEXColor = "#dda0dd";
  static salmon: SDHEXColor = "#fa8072";
  static tan: SDHEXColor = "#d2b48c";
  static turquoise: SDHEXColor = "#40e0d0";

  // Dark variants
  static darkRed: SDHEXColor = "#b13535";
  static darkBlue: SDHEXColor = "#89a4a7";
  static darkGrey: SDHEXColor = "#808080";
  static darkGray: SDHEXColor = "#808080";
  static darkPink: SDHEXColor = "#ff1493";
  static darkGreen: SDHEXColor = "#006400";
  static darkOrange: SDHEXColor = "#b4610e";
  static darkPurple: SDHEXColor = "#9932cc";
  static darkCyan: SDHEXColor = "#008b8b";
  static darkGoldenrod: SDHEXColor = "#b8860b";
  static darkKhaki: SDHEXColor = "#bdb76b";
  static darkMagenta: SDHEXColor = "#8b008b";
  static darkOlive: SDHEXColor = "#556b2f";
  static darkSalmon: SDHEXColor = "#e9967a";
  static darkSeaGreen: SDHEXColor = "#8fbc8f";
  static darkSlateBlue: SDHEXColor = "#483d8b";
  static darkSlateGrey: SDHEXColor = "#2f4f4f";
  static darkTurquoise: SDHEXColor = "#00ced1";
  static darkViolet: SDHEXColor = "#9400d3";

  // Pure colors
  static pureRed: SDHEXColor = "#ff0000";
  static pureBlue: SDHEXColor = "#0000ff";
  static pureGreen: SDHEXColor = "#00ff00";

  // Light variants
  static lightRed: SDHEXColor = "#ff6347";
  static lightBlue: SDHEXColor = "#add8e6";
  static lightCoral: SDHEXColor = "#f08080";
  static lightCyan: SDHEXColor = "#e0ffff";
  static lightGreen: SDHEXColor = "#90ee90";
  static lightGrey: SDHEXColor = "#d3d3d3";
  static lightPink: SDHEXColor = "#ffb6c1";
  static lightSalmon: SDHEXColor = "#ffa07a";
  static lightSeaGreen: SDHEXColor = "#20b2aa";
  static lightSkyBlue: SDHEXColor = "#87cefa";
  static lightYellow: SDHEXColor = "#ffffe0";

  // Special colors
  static textBlue: SDHEXColor = "#24b7ff";
  static aliceBlue: SDHEXColor = "#f0f8ff";
  static chocolate: SDHEXColor = "#d2691e";
  static paleGreen: SDHEXColor = "#98fb98";
  static peachPuff: SDHEXColor = "#ffdab9";
  static buttonGrey: SDHEXColor = "#f0f0f0";
  static ghostWhite: SDHEXColor = "#f8f8ff";
  static deepSkyBlue: SDHEXColor = "#00bfff";
  static lemonChiffon: SDHEXColor = "#fffacd";
  static darkButtonGrey: SDHEXColor = "#767676";
  static crimson: SDHEXColor = "#dc143c";
  static hotPink: SDHEXColor = "#ff69b4";
  static mediumPurple: SDHEXColor = "#9370db";
  static mediumSeaGreen: SDHEXColor = "#3cb371";
  static mediumSlateBlue: SDHEXColor = "#7b68ee";
  static mediumSpringGreen: SDHEXColor = "#00fa9a";
  static mediumTurquoise: SDHEXColor = "#48d1cc";
  static mediumVioletRed: SDHEXColor = "#c71585";
  static midnightBlue: SDHEXColor = "#191970";
  static mistyRose: SDHEXColor = "#ffe4e1";
  static orchid: SDHEXColor = "#da70d6";
  static paleVioletRed: SDHEXColor = "#db7093";
  static powderBlue: SDHEXColor = "#b0e0e6";
  static rosyBrown: SDHEXColor = "#bc8f8f";
  static royalBlue: SDHEXColor = "#4169e1";
  static sandyBrown: SDHEXColor = "#f4a460";
  static seaGreen: SDHEXColor = "#2e8b57";
  static skyBlue: SDHEXColor = "#87ceeb";
  static slateBlue: SDHEXColor = "#6a5acd";
  static slateGrey: SDHEXColor = "#708090";
  static springGreen: SDHEXColor = "#00ff7f";
  static steelBlue: SDHEXColor = "#4682b4";
  static tomato: SDHEXColor = "#ff6347";
  static wheat: SDHEXColor = "#f5deb3";
  static yellowGreen: SDHEXColor = "#9acd32";

  static RED = { fill: this.red, stroke: this.darkRed };
  static BLUE = { fill: this.blue, stroke: this.darkBlue };
  static GREY = { fill: this.grey, stroke: this.darkGrey };
  static GRAY = { fill: this.gray, stroke: this.darkGray };
  static GREEN = { fill: this.green, stroke: this.darkGreen };
  static ORANGE = { fill: this.orange, stroke: this.darkOrange };
  static PURPLE = { fill: this.purple, stroke: this.darkPurple };
  static YELLOW = { fill: this.yellow, stroke: this.gold };
  static CYAN = { fill: this.cyan, stroke: this.darkCyan };
  static PINK = { fill: this.pink, stroke: this.darkPink };
  static DEFAULT = { fill: this.white, stroke: this.black };
  static BUTTON_GREY = { fill: this.buttonGrey, stroke: this.darkButtonGrey };

  static random(): string {
    const hexCharacters = "0123456789abcdef";
    const randHex = () => hexCharacters[rand(0, hexCharacters.length - 1)];
    return "#" + Array.from({ length: 6 }, randHex).join("");
  }

  static equal(a: SDAllColor, b: SDAllColor): boolean {
    if (this.isPacket(a) && this.isPacket(b))
      return this.equal(a.fill, b.fill) && this.equal(a.stroke, b.stroke);
    if (this.isPacket(a) || this.isPacket(b)) return false;
    const hexA = this.toHEX(a);
    const hexB = this.toHEX(b);
    return hexA.toLowerCase() === hexB.toLowerCase();
  }

  static gradient(
    start: SDColor,
    end: SDColor,
    l: number,
    r: number,
  ): (at: number) => SDRGBColor {
    const startRgb = this.toRGB(start);
    const endRgb = this.toRGB(end);
    return (at: number) => {
      const k = (at - l) / (r - l);
      const color = {
        r: startRgb.r + (endRgb.r - startRgb.r) * k,
        g: startRgb.g + (endRgb.g - startRgb.g) * k,
        b: startRgb.b + (endRgb.b - startRgb.b) * k,
      };
      return color;
    };
  }

  static doubleGradient(
    start: SDColor,
    mid: SDColor,
    end: SDColor,
    l: number,
    m: number,
    r: number,
  ): (at: number) => SDRGBColor {
    const g1 = this.gradient(start, mid, l, m);
    const g2 = this.gradient(mid, end, m, r);
    return (at: number) => (at <= m ? g1(at) : g2(at));
  }

  static isRGB(color: SDAllColor): color is SDRGBColor {
    return (
      typeof color === "object" && "r" in color && "g" in color && "b" in color
    );
  }

  static isHEX(color: SDAllColor): color is SDHEXColor {
    return typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color);
  }

  static isPacket(color: SDAllColor): color is SDPacketColor {
    return typeof color === "object" && "fill" in color && "stroke" in color;
  }

  static isColor(color: any): color is SDAllColor {
    return this.isRGB(color) || this.isHEX(color) || this.isPacket(color);
  }

  static toRGB(color: SDColor): SDRGBColor {
    if (typeof color === "string") {
      if (color.startsWith("#")) return hexToRgb(color as SDHEXColor);
      return literalToRgba(color as SDLiteralColor);
    }
    return color;
  }

  static toRGBA(color: SDColor): SDRGBAColor {
    if (typeof color === "string") {
      if (color.startsWith("#")) return hexToRgba(color as SDHEXColor);
      return literalToRgba(color as SDLiteralColor);
    }
    return { ...color, a: (color as SDRGBAColor).a ?? 1 };
  }

  static toHEX(color: SDColor): SDHEXColor {
    if (typeof color === "string") return color as SDHEXColor;
    return rgbToHex(color);
  }

  static toFill(color: SDAllColor): SDColor {
    if (this.isPacket(color)) return color.fill;
    return color;
  }

  static toStroke(color: SDAllColor): SDColor {
    if (this.isPacket(color)) return color.stroke;
    return color;
  }

  static toString(color: SDColor): string {
    if ((color as any) === "currentColor") return "currentColor";
    const rgba = this.toRGBA(color);
    if (rgba) return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    return undefined;
  }
}

export function color() {
  return Color;
}

function hexToNumber(str: string): number {
  return parseInt(str, 16);
}

function numberToHex(number: number): string {
  return Math.floor(number).toString(16).padStart(2, "0");
}

function hexToRgb(hex: string): SDRGBColor {
  let color = hex.replace("#", "");
  if (color.length === 3)
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  return {
    r: hexToNumber(color.slice(0, 2)),
    g: hexToNumber(color.slice(2, 4)),
    b: hexToNumber(color.slice(4, 6)),
  };
}

function hexToRgba(hex: SDHEXColor): SDRGBAColor {
  let color = hex.replace("#", "");
  if (color.length === 3)
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  return {
    r: hexToNumber(color.slice(0, 2)),
    g: hexToNumber(color.slice(2, 4)),
    b: hexToNumber(color.slice(4, 6)),
    a: 1,
  };
}

function rgbToHex(color: SDRGBColor): SDHEXColor {
  return `#${numberToHex(color.r) + numberToHex(color.g) + numberToHex(color.b)}`;
}

function literalToRgba(literal: SDLiteralColor): SDRGBAColor {
  if (literal === "none") return { r: 0, g: 0, b: 0, a: 0 };
  if (literal === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  return hexToRgba(Color[literal]);
}

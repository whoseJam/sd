export class SDColor {
    fill: string;
    stroke: string;
}

export class Color {
    static red: string;
    static blue: string;
    static cyan: string;
    static grey: string;
    static pink: string;
    static snow: string;
    static azure: string;
    static black: string;
    static coral: string;
    static green: string;
    static white: string;
    static orange: string;
    static purple: string;
    static violet: string;
    static yellow: string;
    static darkRed: string;
    static pureRed: string;
    static darkBlue: string;
    static darkGrey: string;
    static darkPink: string;
    static pureBlue: string;
    static textBlue: string;
    static aliceBlue: string;
    static chocolate: string;
    static darkGreen: string;
    static paleGreen: string;
    static peachPuff: string;
    static pureGreen: string;
    static buttonGrey: string;
    static darkOrange: string;
    static darkPurple: string;
    static ghostWhite: string;
    static lightCoral: string;
    static deepSkyBlue: string;
    static lemonChiffon: string;
    static darkButtonGrey: string;

    static RED: SDColor;
    static BLUE: SDColor;
    static GREY: SDColor;
    static GREEN: SDColor;
    static ORANGE: SDColor;
    static PURPLE: SDColor;
    static DEFAULT: SDColor;
    static BUTTON_GREY: SDColor;

    static random(): stirng;
    static equal(a: SDColor, b: SDColor): boolean;
    static gradient(start: string, end: string, l: number, r: number): (grad: number) => string;
    static doubleGradient(start: string, mid: string, end: string, l: number, m: number, r: number): (grad: number) => string;
}

export function color(): typeof Color;

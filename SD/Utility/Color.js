import { randHexColor } from "@/Utility/Random";

export class Color {
    static red = "#f14c4c";
    static blue = "#bbe0e3";
    static cyan = "#00FFFF";
    static grey = "#cccccc";
    static pink = "#FF69B4";
    static snow = "#fffafa";
    static azure = "#F0FFFF";
    static black = "#000000";
    static brown = "#8B4726";
    static coral = "#FF7256";
    static green = "#92d050";
    static white = "#ffffff";
    static orange = "#f58617";
    static purple = "#DA70D6";
    static violet = "#ee82ee";
    static yellow = "#ffff4d";
    static darkRed = "#b13535";
    static pureRed = "#ff0000";
    static darkBlue = "#89a4a7";
    static darkGrey = "#808080";
    static darkPink = "#FF1493";
    static pureBlue = "#0000ff";
    static textBlue = "#24b7ff";
    static aliceBlue = "#F0F8FF";
    static chocolate = "#D2691E";
    static darkGreen = "#006400";
    static paleGreen = "#98FB98";
    static peachPuff = "#FFDAB9";
    static pureGreen = "#00ff00";
    static buttonGrey = "#F0F0F0";
    static darkOrange = "#b4610e";
    static darkPurple = "#9932CC";
    static ghostWhite = "#F8F8FF";
    static deepSkyBlue = "#00bfff";
    static lemonChiffon = "#FFFACD";
    static darkButtonGrey = "#767676";

    static RED = { fill: this.red, stroke: this.darkRed };
    static BLUE = { fill: this.blue, stroke: this.darkBlue };
    static GREY = { fill: this.grey, stroke: this.darkGrey };
    static GREEN = { fill: this.green, stroke: this.darkGreen };
    static ORANGE = { fill: this.orange, stroke: this.darkOrange };
    static PURPLE = { fill: this.purple, stroke: this.darkPurple };
    static DEFAULT = { fill: this.white, stroke: this.black };
    static BUTTON_GREY = { fill: this.buttonGrey, stroke: this.darkButtonGrey };

    static random = randHexColor;

    static equal(a, b) {
        if (a.fill && b.fill) return a.fill === b.fill && a.stroke === b.stroke;
        if (!a.fill && !b.fill) return a === b;
        return false;
    }

    static gradient(source, target, l, r) {
        source = HexToRGB(source);
        target = HexToRGB(target);
        return function (at) {
            const k = (at - l) / (r - l);
            const color = {
                r: source.r + (target.r - source.r) * k,
                g: source.g + (target.g - source.g) * k,
                b: source.b + (target.b - source.b) * k,
            };
            return RGBToHex(color);
        };
    }
}

export function color() {
    return Color;
}

function HexToNumber(str) {
    const v0 = str.charCodeAt(0);
    const v1 = str.charCodeAt(1);
    function GetNumber(v) {
        if (65 <= v && v <= 90) return v - 65 + 10;
        if (97 <= v && v <= 122) return v - 97 + 10;
        return v - 48;
    }
    return GetNumber(v0) * 16 + GetNumber(v1);
}

function NumberToHex(number) {
    let ans = "";
    number = Math.floor(number);
    while (number > 0) {
        const v = number % 16;
        if (0 <= v && v <= 9) ans = v + ans;
        else ans = String.fromCharCode(v + 97 - 10) + ans;
        number >>= 4;
    }
    if (ans.length === 0) ans = "00";
    else if (ans.length === 1) ans = "0" + ans;
    return ans;
}

function HexToRGB(str) {
    return {
        r: HexToNumber(str.slice(1, 3)),
        g: HexToNumber(str.slice(3, 5)),
        b: HexToNumber(str.slice(5, 7)),
    };
}

function RGBToHex(color) {
    return "#" + NumberToHex(color.r) + NumberToHex(color.g) + NumberToHex(color.b);
}

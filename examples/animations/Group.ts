import * as sd from "@/sd";

class TextBox extends sd.Group {
    constructor() {
        super([new sd.Rect(), new sd.Circle()]);
    }
}

const svg = sd.svg();

const rect = new sd.Rect();
const circle = new sd.Circle();
const textBox = new TextBox();

svg.appendChild(rect);
svg.appendChild(circle);
svg.appendChild(textBox);

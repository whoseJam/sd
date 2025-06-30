import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/Text/Text";
import { createRenderNode } from "@/Renderer/RenderNode";
import { MathjaxNode } from "@/Renderer/SVG/MathjaxNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Color as C } from "@/Utility/Color";
import { PathPen } from "@/Utility/PathPen";
import opentype from "opentype.js";

class TransformingPath {
    d: string;
    transform: { a: number; b: number; c: number; d: number; e: number; f: number };
    character: string;
    fill: string;
    stroke: string;
    strokeWidth: number;
    path: SVGPathElement;
    constructor(d, transform, character = undefined) {
        this.d = d;
        this.transform = transform;
        this.character = character;
        this.fill = C.black;
        this.stroke = C.black;
        this.strokeWidth = 0;
    }
    cloneVisionPropertyFrom(path: TransformingPath) {
        this.character = path.character;
        this.fill = path.fill;
        this.stroke = path.stroke;
        this.strokeWidth = path.strokeWidth;
        return this;
    }
    init(group: SVGNode) {
        if (!this.path) this.path = Dom.createSVGElement("path") as SVGPathElement;
        const transform = this.transform;
        this.path.setAttribute("d", this.d);
        this.path.setAttribute("transform", `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.e},${transform.f})`);
        this.path.setAttribute("fill", this.fill);
        this.path.setAttribute("stroke", this.stroke);
        this.path.setAttribute("stroke-width", String(this.strokeWidth));
        group.__append(this.path);
    }
}

class TransformingPathGroup {
    parent: Text;
    source: Array<TransformingPath>;
    target: Array<TransformingPath>;
    group: SVGNode;
    l: number;
    r: number;
    constructor(parent) {
        this.parent = parent;
        this.source = [];
        this.target = [];
        this.l = parent.delay();
        this.r = parent.delay() + parent.duration();
    }
    fillSource() {
        if (this.source.length < this.target.length) {
            const source = [];
            const count = this.target.length - this.source.length;
            const gap = Math.floor(this.source.length / count);
            if (this.source.length === 0) {
                for (let i = this.target.length - 1; i >= 0; i--) {
                    const matrix = this.target[i].transform;
                    const path = new TransformingPath(this.target[i].d, {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        e: matrix.e,
                        f: matrix.f,
                    }).cloneVisionPropertyFrom(this.target[i]);
                    source.push(path);
                }
            } else if (gap > 0) {
                let current = 0;
                for (let i = this.source.length - 1; i >= 0; i--) {
                    if ((this.source.length - 1 - i) % gap === 0 && current < count) {
                        const path = new TransformingPath(this.source[i].d, this.source[i].transform).cloneVisionPropertyFrom(this.source[i]);
                        source.push(path);
                        current++;
                    }
                    source.push(this.source[i]);
                }
            } else {
                let current = 0;
                const copy = Math.ceil(count / this.source.length);
                for (let i = this.source.length - 1; i >= 0; i--) {
                    for (let j = 1; j <= copy && current < count; j++) {
                        const path = new TransformingPath(this.source[i].d, this.source[i].transform).cloneVisionPropertyFrom(this.source[i]);
                        source.push(path);
                        current++;
                    }
                    source.push(this.source[i]);
                }
            }
            this.source = source.reverse();
        }
    }
    fillTarget() {
        if (this.source.length > this.target.length) {
            const target = [];
            const count = this.source.length - this.target.length;
            const gap = Math.floor(this.target.length / count);
            if (gap > 0) {
                let current = 0;
                for (let i = this.target.length - 1; i >= 0; i--) {
                    if ((this.target.length - 1 - i) % gap === 0 && current < count) {
                        const path = new TransformingPath(this.target[i].d, this.target[i].transform).cloneVisionPropertyFrom(this.target[i]);
                        target.push(path);
                        current++;
                    }
                    target.push(this.target[i]);
                }
            } else {
                let current = 0;
                const copy = Math.ceil(count / this.target.length);
                for (let i = this.target.length - 1; i >= 0; i--) {
                    for (let j = 1; j <= copy && current < count; j++) {
                        const path = new TransformingPath(this.target[i].d, this.target[i].transform).cloneVisionPropertyFrom(this.target[i]);
                        target.push(path);
                        current++;
                    }
                    target.push(this.target[i]);
                }
            }
            this.target = target.reverse();
        }
    }
    init() {
        this.fillSource();
        this.fillTarget();
    }
    play() {
        const context = new Context(this.parent);
        context.till(0, 0);
        if (this.group) this.group.remove();
        this.group = createRenderNode(this.parent, svg(), "g");
        context.till(0, 1);
        this.init();
        for (const source of this.source) source.init(this.group);

        const matrixEqual = (a, b) => {
            for (const key of ["a", "b", "c", "d", "e", "f"]) if (a[key] !== b[key]) return false;
            return true;
        };
        for (let i = 0; i < this.source.length; i++) {
            const source = this.source[i];
            const target = this.target[i];
            const path = source.path;
            if (!target) {
                new Action(this.l, this.r, 1, 0, Interp.numberInterp(path, "opacity"), path, "opacity");
            } else {
                const sd = source.d;
                const td = target.d;
                new Action(this.l, this.r, sd, td, Interp.pathInterp(path, "d"), path, "d");
                const sm = source.transform;
                const tm = target.transform;
                if (!matrixEqual(sm, tm)) new Action(this.l, this.r, sm, tm, Interp.matrixInterp(path, "transform"), path, "transform");
                const sf = source.fill;
                const tf = target.fill;
                if (sf !== tf) new Action(this.l, this.r, sf, tf, Interp.colorInterp(path, "fill"), path, "fill");
                const ss = source.stroke;
                const ts = target.stroke;
                if (ss !== ts) new Action(this.l, this.r, ss, ts, Interp.colorInterp(path, "stroke"), path, "stroke");
                const sw = source.strokeWidth;
                const tw = target.strokeWidth;
                if (sw !== tw) new Action(this.l, this.r, sw, tw, Interp.numberInterp(path, "stroke-width"), path, "stroke-width");
            }
        }
        context.till(1, 1);
        this.group.remove();
        context.recover();
    }
    fill(fill) {
        for (const path of this.source) {
            new Action(this.l, this.r, path.fill, fill, Interp.colorInterp(path.path, "fill"), path, "fill");
            path.fill = fill;
        }
    }
    stroke(stroke) {
        for (const path of this.source) {
            new Action(this.l, this.r, path.stroke, stroke, Interp.colorInterp(path.path, "stroke"), path, "stroke");
            path.stroke = stroke;
        }
    }
    strokeWidth(width) {
        for (const path of this.source) {
            new Action(this.l, this.r, path.strokeWidth, width, Interp.numberInterp(path.path, "strokeWidth"), path, "strokeWidth");
            path.strokeWidth = width;
        }
    }
    rebuildByText(text, family, size, attr, x, y) {
        const t = [];
        const targetPaths = TextEngine.getPaths(text, family, size, x, y);
        const getAttribute = (attr, i, key, default_) => {
            if (attr[i] === undefined) return default_;
            if (attr[i][key] === undefined) return default_;
            return attr[i][key];
        };
        for (let i = 0; i < targetPaths.length; i++) {
            const path = targetPaths[i];
            const d = path.toPathData(4);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, text[i]);
            p.stroke = getAttribute(attr, i, "stroke", this.parent.stroke());
            p.fill = getAttribute(attr, i, "fill", this.parent.fill());
            t.push(p);
        }
        this.target = t;
    }
    replayByMathjax(math: MathjaxNode) {
        const t = TextEngine.getMathjaxPaths(math);
        this.target = t;
        this.play();
    }
    replayByText(target) {
        this.rebuildByText(target.text, target.family, target.size, target.attr, target.x, target.y);
        this.play();
    }
}

function getTextWidth(font, text, fontSize) {
    let width = 0;
    const glyphs = font.stringToGlyphs(text);
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        width += glyph.advanceWidth * (fontSize / font.unitsPerEm);
        if (i < glyphs.length - 1) {
            const kerning = font.getKerningValue(glyph, glyphs[i + 1]);
            width += kerning * (fontSize / font.unitsPerEm);
        }
    }
    return width;
}

export class TextEngine {
    static textSVG = undefined;
    static mathjaxSVG = undefined;
    static fonts = {};
    static init() {
        this.load("Arial");
        this.load("Consolas");
        this.load("Times New Roman");
        this.textSVG = svg().append("text");
        this.textSVG.setAttribute("fill-opacity", 0);
        this.textSVG.setAttribute("stroke-opacity", 0);
        this.textSVG.setAttribute("font-family", "consolas");
        this.mathjaxSVG = svg().append("g");
        this.mathjaxSVG.setAttribute("opacity", 0);
        this.mathjaxSVG.setAttribute("font-size", 20);
    }
    static fontExists(family) {
        return this.fonts[family] !== undefined;
    }
    static load(family) {
        const currentScript = document.currentScript;
        const domain = currentScript.getAttribute("src").split("/").slice(0, -1).join("/");
        const url = `${domain}/${family}.ttf`;
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                this.fonts[family] = opentype.parse(buffer);
            });
    }
    static boundingBox(text, family, size) {
        if (!this.fonts[family]) {
            this.textSVG.setAttribute("text", text);
            this.textSVG.setAttribute("font-size", size);
            this.textSVG.setAttribute("font-family", family);
            const bbox = this.textSVG.nake().getBBox();
            return bbox;
        } else {
            const font = this.fonts[family];
            const ascender = font.ascender;
            const descender = -font.descender;
            const lineGap = font.lineGap || 4.478993055555556;
            const scale = size / font.unitsPerEm;
            const height = (ascender + descender + lineGap) * scale;
            const width = getTextWidth(this.fonts[family], text, size);
            return { width, height };
        }
    }
    static mathjaxBoundingBox(math: MathjaxNode) {
        const render = math.render;
        this.mathjaxSVG.__append(math);
        const bbox = this.mathjaxSVG.nake().getBBox();
        render.__append(math);
        return bbox;
    }
    static widthToFontSize(text, family, width) {
        const box = this.boundingBox(text, family, 20);
        return (width / box.width) * 20;
    }
    static heightToFontSize(text, family, height) {
        const box = this.boundingBox(text, family, 20);
        return (height / box.height) * 20;
    }
    static getPaths(text, family, size, x, y) {
        const font = this.fonts[family];
        const unitsPerEm = font.unitsPerEm;
        const ascender = font.ascender;
        const descender = -font.descender;
        const lineGap = font.lineGap || 4.478993055555556;
        const scale = size / unitsPerEm;
        const height = (ascender + descender + lineGap) * scale;
        const offset = -descender * scale;
        return font.getPaths(text, x, y + height + offset, size);
    }
    static getMathjaxPaths(element: MathjaxNode) {
        const defs = element.nake().children[0];
        const root = element.nake().children[1];
        const paths = [];
        const initialMatrix = () => {
            const svg = element.nake();
            const view = svg.getAttribute("viewBox").split(" ");
            const [vx, vy, vw, vh] = [+view[0], +view[1], +view[2], +view[3]];
            const x = +svg.getAttribute("x");
            const y = +svg.getAttribute("y");
            const bbox = TextEngine.mathjaxBoundingBox(element);
            const ibbox = (element.nake().children[1] as SVGGElement).getBBox();
            const w = bbox.width * (vw / ibbox.width);
            const h = bbox.height;
            return {
                a: w / vw,
                b: 0,
                c: 0,
                d: h / vh,
                e: x - (w / vw) * vx,
                f: y - (h / vh) * vy,
            };
        };
        const multiply = (matrix1, matrix2) => {
            return {
                a: matrix1.a * matrix2.a + matrix1.c * matrix2.b,
                b: matrix1.b * matrix2.a + matrix1.d * matrix2.b,
                c: matrix1.a * matrix2.c + matrix1.c * matrix2.d,
                d: matrix1.b * matrix2.c + matrix1.d * matrix2.d,
                e: matrix1.a * matrix2.e + matrix1.c * matrix2.f + matrix1.e,
                f: matrix1.b * matrix2.e + matrix1.d * matrix2.f + matrix1.f,
            };
        };
        const extract = (current, defs): [string, string] => {
            if (Dom.tagName(current) === "rect") {
                const x = +current.getAttribute("x");
                const y = +current.getAttribute("y");
                const mx = +current.getAttribute("width") + x;
                const my = +current.getAttribute("height") + y;
                const d = new PathPen().MoveTo(x, y).LinkTo(mx, y).LinkTo(mx, my).LinkTo(x, my).LinkTo(x, y).toString();
                return [d, undefined];
            } else {
                const href = current.getAttribute("xlink:href");
                const data = current.getAttribute("data-c");
                const ssrc = defs.querySelector(href);
                return [ssrc.getAttribute("d"), data];
            }
        };
        const dfs = (current, matrix: { a: number; b: number; c: number; d: number; e: number; f: number }, fill: string, stroke: string) => {
            for (let i = 0; i < current.transform.baseVal.length; i++) matrix = multiply(matrix, current.transform.baseVal[i].matrix);
            fill = current.getAttribute("fill") || fill;
            stroke = current.getAttribute("stroke") || stroke;
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
                const [d, character] = extract(current, defs);
                const p = new TransformingPath(d, matrix, character);
                p.fill = fill;
                p.stroke = stroke;
                paths.push(p);
            }
            for (const child of current.children) dfs(child, matrix, fill, stroke);
        };
        dfs(root, initialMatrix(), element.getAttribute("fill"), element.getAttribute("stroke"));
        return paths;
    }
    static transformPaths(parent, source, target) {
        const group = new TransformingPathGroup(parent);
        group.source = source;
        group.target = target;
        group.play();
        return group;
    }
    static transformText(parent, source, target) {
        const s = [];
        const t = [];
        const sourcePaths = this.getPaths(source.text, source.family, source.size, source.x, source.y);
        const targetPaths = this.getPaths(target.text, target.family, target.size, target.x, target.y);
        const getAttribute = (object, i, key, default_) => {
            if (!object.attr) return default_;
            if (object.attr[i] === undefined) return default_;
            if (object.attr[i][key] === undefined) return default_;
            return object.attr[i][key];
        };
        for (let i = 0; i < sourcePaths.length; i++) {
            const path = sourcePaths[i];
            const d = path.toPathData(4);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, source.text[i]);
            p.fill = getAttribute(source, i, "fill", parent.fill());
            p.stroke = getAttribute(source, i, "stroke", parent.stroke());
            p.strokeWidth = getAttribute(source, i, "strokeWidth", parent.strokeWidth());
            s.push(p);
        }
        for (let i = 0; i < targetPaths.length; i++) {
            const path = targetPaths[i];
            const d = path.toPathData(4);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, target.text[i]);
            p.fill = getAttribute(target, i, "fill", parent.fill());
            p.stroke = getAttribute(target, i, "stroke", parent.stroke());
            p.strokeWidth = getAttribute(target, i, "strokeWidth", parent.strokeWidth());
            t.push(p);
        }
        return this.transformPaths(parent, s, t);
    }
    static transformMathjax(parent: SDNode, source: MathjaxNode, target: MathjaxNode) {
        const s = this.getMathjaxPaths(source);
        const t = this.getMathjaxPaths(target);
        return this.transformPaths(parent, s, t);
    }
    static adjustMathjax(math: MathjaxNode) {
        const render = math.render;
        this.mathjaxSVG.__append(math);
        const root = math.nake().children[1] as SVGGElement;
        const ibbox = root.getBBox();
        const transform = `${root.getAttribute("transform")} translate(${-ibbox.x},0)`;
        root.setAttribute("transform", transform);
        render.__append(math);
    }
    static findSubtextInMathjax(math: MathjaxNode, subtext: string) {
        const mml = new DOMParser().parseFromString(MathJax.tex2mml(subtext), "text/xml").documentElement;
        function nodeContentSVG(s: SVGElement) {
            const use = s.querySelector("use");
            const unicode = use.getAttribute("data-c");
            return String.fromCodePoint(parseInt(unicode, 16));
        }
        function nodeContentHTML(m: HTMLElement) {
            function toMathLetter(char, style = "italic") {
                const styles = {
                    italic: { lower: 0x1d44e, upper: 0x1d434 }, 
                    bold: { lower: 0x1d41a, upper: 0x1d400 }, 
                    bolditalic: { lower: 0x1d482, upper: 0x1d468 }, 
                    script: { lower: 0x1d4b6, upper: 0x1d49c }, 
                    double: { lower: 0x1d4ea, upper: 0x1d4d0 }, 
                };
                if (!styles[style]) throw new Error(`Unsupported style: ${style}`);
                const code = char.charCodeAt(0);
                if (code >= 0x61 && code <= 0x7a) {
                    const offset = styles[style].lower - 0x61;
                    return String.fromCodePoint(code + offset);
                } else if (code >= 0x41 && code <= 0x5a) {
                    const offset = styles[style].upper - 0x41;
                    return String.fromCodePoint(code + offset);
                }
                return char;
            }
            return toMathLetter(m.textContent);
        }
        function matchRecursively(s: SVGElement, m: HTMLElement) {
            if (s.getAttribute("data-mml-node") !== m.tagName.toLowerCase()) return false;
            if (m.childElementCount === 0) {
                const scharacter = nodeContentSVG(s);
                const mcharacter = nodeContentHTML(m);
                return scharacter === mcharacter;
            }
            if (s.children.length !== m.children.length) return false;
            for (let i = 0; i < s.children.length; i++) {
                if (!matchRecursively(s.children[i] as SVGElement, m.children[i] as HTMLElement)) {
                    return false;
                }
            }
            return true;
        }
        function match(s: SVGElement, m: HTMLElement, start: number) {
            if (start + m.children.length > s.children.length) return false;
            for (let i = 0; i < m.children.length; i++)
                if (!matchRecursively(s.children[i + start] as SVGElement, m.children[i] as HTMLElement)) {
                    return false;
                }
            return true;
        }
        const matched = [];
        function walk(s: SVGElement, m: HTMLElement) {
            for (let start = 0; start < s.children.length; start++) {
                if (match(s, m, start)) {
                    matched.push({
                        element: s,
                        start,
                        length: m.children.length,
                    });
                }
            }
            for (let i = 0; i < s.children.length; i++) {
                walk(s.children[i] as SVGElement, m);
            }
        }
        walk(math.nake().children[1] as SVGElement, mml);
        return matched;
    }
    static cloneMathjax(element: SVGElement): SVGElement {
        let root = Dom.deepClone(element);
        while (Dom.parent(element)) {
            const parent = Dom.parent(element);
            const parent_ = Dom.clone(parent);
            if (Dom.tagName(parent) === "svg") {
                const defs = Dom.deepClone(parent.children[0]);
                parent_.append(defs);
                parent_.append(root);
                root = parent_;
                break;
            } else {
                parent_.append(root);
                root = parent_;
                element = parent as SVGElement;
            }
        }
        return root;
    }
}

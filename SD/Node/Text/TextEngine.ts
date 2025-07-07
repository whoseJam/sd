import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { Mathjax } from "@/Node/Text/Mathjax";
import { Text } from "@/Node/Text/Text";
import { createRenderNode } from "@/Renderer/RenderNode";
import { MathjaxNode } from "@/Renderer/SVG/MathjaxNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { PathPen } from "@/Utility/PathPen";
import { make1d } from "@/Utility/Util";
import opentype from "opentype.js";

class TransformingPath {
    d: string;
    transform: { a: number; b: number; c: number; d: number; e: number; f: number };
    character: string;
    fill: string;
    stroke: string;
    status: string;
    path: SVGPathElement;
    constructor(d, transform, character = undefined) {
        this.d = d;
        this.transform = transform;
        this.character = character;
        this.fill = C.black;
        this.stroke = C.black;
        this.status = "normal";
    }
    cloneVisionPropertyFrom(path: TransformingPath) {
        this.character = path.character;
        this.fill = path.fill;
        this.stroke = path.stroke;
        return this;
    }
    init(group: SVGNode) {
        if (!this.path) this.path = Dom.createSVGElement("path") as SVGPathElement;
        const transform = this.transform;
        this.path.setAttribute("d", this.d);
        this.path.setAttribute("transform", `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.e},${transform.f})`);
        this.path.setAttribute("fill", this.fill);
        this.path.setAttribute("stroke", this.stroke);
        this.path.setAttribute("stroke-width", "0");
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
                    const path = new TransformingPath(this.target[i].d, this.target[i].transform).cloneVisionPropertyFrom(this.target[i]);
                    path.status = "opacity:0->1";
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
            if (this.target.length === 0) {
                for (let i = 0; i < this.source.length; i++) {
                    this.source[i].status = "opacity:1->0";
                }
            } else if (gap > 0) {
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
        this.group = createRenderNode(this.parent, this.parent.layer(), "g");
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
            if (source.status !== "normal") {
                const so = +source.status.slice(8, 9);
                const to = +source.status.slice(11);
                new Action(this.l, this.r, so, to, Interp.numberInterp(path, "opacity"), path, "opacity");
            }
            if (target) {
                const sd = source.d;
                const td = target.d;
                new Action(this.l, this.r, sd, td, Interp.pathInterp(path, "d"), path, "d");
                const sm = source.transform;
                const tm = target.transform;
                if (!matrixEqual(sm, tm)) new Action(this.l, this.r, sm, tm, Interp.matrixInterp(path, "transform"), path, "transform");
                const sf = source.fill;
                const tf = target.fill;
                if (sf !== tf) new Action(this.l, this.r, sf, tf, Interp.colorInterp(path, "fill"), path, "fill");
                source.fill = target.fill;
                const ss = source.stroke;
                const ts = target.stroke;
                if (ss !== ts) new Action(this.l, this.r, ss, ts, Interp.colorInterp(path, "stroke"), path, "stroke");
                source.stroke = target.stroke;
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
    replay(target: Array<TransformingPath>, valid: Array<boolean>) {
        this.target = target.filter((path, i) => !Array.isArray(valid) || valid[i]);
        this.play();
    }
}

class TextMatching {
    text: string;
    deleted: Array<boolean>;
    constructor(text: string) {
        this.text = text;
        this.deleted = make1d(text.length, false);
    }
    match(subtext: string) {
        for (let i = 0; i < this.text.length; i++) {
            let matched = true;
            for (let j = 0; j < subtext.length && matched; j++) {
                if (this.text[i + j] !== subtext[j] || this.deleted[i + j]) matched = false;
            }
            if (matched) return i;
        }
        return -1;
    }
    remove(subtext: string, i: number, callback?: (i: number) => void) {
        for (let j = i; j < i + subtext.length; j++) {
            this.deleted[j] = true;
            if (callback) callback(j);
        }
    }
}

class MathjaxMatching {
    text: MathjaxNode;
    pathDeleted: Array<boolean>;
    elementDeleted: WeakSet<Element>;
    constructor(text: MathjaxNode, length: number) {
        this.text = text;
        this.pathDeleted = make1d(length, false);
        this.elementDeleted = new WeakSet();
    }
    match(subtext: string) {
        const matched = TextEngine.findFirstSubtextInMathjax(this.text, subtext, this);
        return matched;
    }
    remove(matched: { element: Element; start: number; length: number }, callback?: (i: number) => void) {
        const element = matched.element;
        const dfs = current => {
            if (this.elementDeleted.has(current)) return;
            this.elementDeleted.add(current);
            for (let i = 0; i < current.children.length; i++) dfs(current.children[i]);
        };
        for (let i = matched.start; i < matched.start + matched.length; i++) dfs(element.children[i]);
        const l = element.children[matched.start].range[0];
        const r = element.children[matched.start + matched.length - 1].range[1];
        for (let i = l; i < r; i++) {
            this.pathDeleted[i] = true;
            if (callback) callback(i);
        }
    }
    matchedAll(matched: { element: Element; start: number; length: number }) {
        const element = matched.element;
        const l = element.children[matched.start].range[0];
        const r = element.children[matched.start + matched.length - 1].range[1];
        return l === 0 && r === this.pathDeleted.length;
    }
    forEachElement(matched: { element: Element; start: number; length: number }, callback: (element: Element) => void) {
        const element = matched.element;
        for (let i = matched.start; i < matched.start + matched.length; i++) {
            callback(element.children[i]);
        }
    }
}

class Transforming {
    parent: SDNode;
    groups: Array<TransformingPathGroup>;
    groupKeys: Array<any>;
    l: number;
    r: number;
    mapping: any;
    constructor(parent, mapping) {
        this.parent = parent;
        this.mapping = mapping;
        this.groups = [];
        this.groupKeys = [];
        this.l = parent.delay();
        this.r = parent.delay() + parent.duration();
    }
    fill(fill) {
        this.groups.forEach(group => group.fill(fill));
    }
    stroke(stroke) {
        this.groups.forEach(group => group.stroke(stroke));
    }
    replayByText(target) {
        const targetText = target.text;
        const targetPaths = TextEngine.getTextPaths(this.parent, target);
        const matching = new TextMatching(targetText);
        const generateValid = check => {
            const result = [];
            for (let i = 0; i < targetText.length; i++) result.push(check(i));
            return result;
        };
        for (const item of this.mapping) {
            const t = matching.match(item.target);
            if (t === -1) continue;
            matching.remove(item.target, t);
            for (let i = 0; i < this.groupKeys.length; i++) {
                if (this.groupKeys[i] === item) {
                    const check = i => t <= i && i < t + item.target.length;
                    this.groups[i].replay(targetPaths, generateValid(check));
                }
            }
        }
        const check = i => !matching.deleted[i];
        this.groups[this.groups.length - 1].replay(targetPaths, generateValid(check));
    }
    replayByMathjax(target: MathjaxNode) {
        const targetMath = target;
        const targetPaths = TextEngine.getMathjaxPaths(target, this.parent as Mathjax);
        const matching = new MathjaxMatching(targetMath, targetPaths.length);
        const generateValid = check => {
            const result = [];
            for (let i = 0; i < targetPaths.length; i++) result.push(check(i));
            return result;
        };
        for (const item of this.mapping) {
            const t = matching.match(item.target);
            if (t === undefined) continue;
            const l = t.element.children[t.start].range[0];
            const r = t.element.children[t.start + t.length - 1].range[1];
            matching.remove(t);
            for (let i = 0; i < this.groupKeys.length; i++) {
                if (this.groupKeys[i] === item) {
                    const check = i => l <= i && i < r;
                    this.groups[i].replay(targetPaths, generateValid(check));
                }
            }
        }
        const check = i => !matching.pathDeleted[i];
        this.groups[this.groups.length - 1].replay(targetPaths, generateValid(check));
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

function processMapping(mapping: any) {
    const result = [];
    if (Array.isArray(mapping)) {
        for (const item of mapping) {
            if (item.length === 2) {
                result.push({
                    source: Check.isNumberOrString(item[0]) ? String(item[0]) : item[0],
                    target: String(item[1]),
                });
            } else {
                result.push({
                    source: {
                        object: item[0],
                        subtext: String(item[1]),
                    },
                    target: String(item[2]),
                });
            }
        }
    } else {
        for (const key in mapping) {
            const value = mapping[key];
            result.push({
                source: String(key),
                target: String(value),
            });
        }
    }
    return result;
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
        const url = `${domain}/fonts/${family}.ttf`;
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                this.fonts[family] = opentype.parse(buffer);
            });
    }
    static boundingBox(text: string, family: string, size: number) {
        function hasChinese(str) {
            const regex = /[\u4e00-\u9fa5]/;
            return regex.test(str);
        }
        if (!this.fonts[family] || hasChinese(text)) {
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
        const parentNode = math.nake().parentNode;
        this.mathjaxSVG.__append(math);
        const bbox = this.mathjaxSVG.nake().getBBox();
        if (parentNode) parentNode.appendChild(math.nake());
        else math.__remove();
        return bbox;
    }
    static mathjaxBoundingBoxAndInnerBoundingBox(math: MathjaxNode) {
        const parentNode = math.nake().parentNode;
        this.mathjaxSVG.__append(math);
        const bbox = this.mathjaxSVG.nake().getBBox();
        const ibbox = (math.nake().children[1] as SVGGElement).getBBox();
        if (parentNode) parentNode.appendChild(math.nake());
        else math.__remove();
        return [bbox, ibbox];
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
    static getTextPaths(parent, config?) {
        if (arguments.length === 1) {
            config = {
                text: parent.text(),
                family: parent.fontFamily(),
                size: parent.fontSize(),
                x: parent.x(),
                y: parent.y(),
            };
        }
        const paths = [];
        const targetPaths = TextEngine.getPaths(config.text, config.family, config.size, config.x, config.y);
        const getAttribute = (attr, i, key, default_) => {
            if (attr === undefined) return default_;
            if (attr[i] === undefined) return default_;
            if (attr[i][key] === undefined) return default_;
            return attr[i][key];
        };
        for (let i = 0; i < targetPaths.length; i++) {
            const path = targetPaths[i];
            const d = path.toPathData(4);
            if (!d) continue;
            const p = new TransformingPath(d, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, config.text[i]);
            p.fill = getAttribute(config.attr, i, "fill", parent.fill());
            p.stroke = getAttribute(config.attr, i, "stroke", parent.stroke());
            paths.push(p);
        }
        return paths;
    }
    static getMathjaxPaths(element: MathjaxNode, parent: Mathjax, old: boolean = false) {
        const defs = element.nake().children[0];
        const root = element.nake().children[1];
        const paths = [];
        const initialMatrix = () => {
            const svg = element.nake();
            const [bbox, ibbox] = TextEngine.mathjaxBoundingBoxAndInnerBoundingBox(element);
            const view = svg.getAttribute("viewBox").split(" ");
            const [vx, vy, vw, vh] = [+view[0], +view[1], +view[2], +view[3]];
            const x = +svg.getAttribute("x");
            const y = +svg.getAttribute("y");
            const w = bbox.width * (vw / ibbox.width);
            const h = bbox.height * (vh / ibbox.height);
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
            const l = paths.length;
            for (let i = 0; i < current.transform.baseVal.length; i++) matrix = multiply(matrix, current.transform.baseVal[i].matrix);
            fill = current.getAttribute("fill") || fill;
            stroke = current.getAttribute("stroke") || stroke;
            if (!Dom.tagName(current)) return;
            if (Dom.tagName(current) === "defs") return;
            if (Dom.tagName(current) === "path") return;
            if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
                const [d, character] = extract(current, defs);
                const p = new TransformingPath(d, matrix, character);
                p.stroke = stroke;
                p.fill = fill;
                paths.push(p);
            }
            for (const child of current.children) dfs(child, matrix, fill, stroke);
            const r = paths.length;
            current.range = [l, r];
        };
        dfs(root, initialMatrix(), old ? parent.__sourceFill() : parent.fill(), old ? parent.__sourceStroke() : parent.stroke());
        return paths;
    }
    static transformPaths(parent, source, target) {
        const group = new TransformingPathGroup(parent);
        group.source = source;
        group.target = target;
        group.play();
        return group;
    }
    static transformText(parent, source, target, mapping = [], auto = true) {
        mapping = processMapping(mapping);
        const sourceText = source.text;
        const targetText = target.text;
        const sourcePaths = this.getTextPaths(parent, source);
        const targetPaths = this.getTextPaths(parent, target);
        const sourceMatching = new TextMatching(sourceText);
        const targetMatching = new TextMatching(targetText);
        const transforming = new Transforming(parent, mapping);
        const matchSourcePaths = item => {
            if (typeof item.source === "string") {
                const s = sourceMatching.match(item.source);
                if (s === -1) return undefined;
                return sourcePaths.slice(s, s + item.source.length);
            } else if (item.source.object) {
                const text = item.source.object;
                const text_ = text.text();
                const subtext = item.source.subtext;
                const paths = this.getTextPaths(text);
                for (let i = 0; i < text_.length; i++) if (text_.slice(i, i + subtext.length) === subtext) return paths.slice(i, i + subtext.length);
                return undefined;
            } else {
                const text = item.source;
                return this.getTextPaths(text);
            }
        };
        const removeSourcePaths = item => {
            if (typeof item.source === "string") {
                const s = sourceMatching.match(item.source);
                sourceMatching.remove(item.source, s);
            } else if (item.source.object) {
            } else {
                const text = item.source;
                if (auto) text.remove();
            }
        };
        for (const item of mapping) {
            const sourceGroup = matchSourcePaths(item);
            if (sourceGroup === undefined) continue;
            const targetGroup = [];
            const t = targetMatching.match(item.target);
            if (t === -1) continue;
            const fill = sameAttribute(sourceGroup, "fill");
            const stroke = sameAttribute(sourceGroup, "stroke");
            removeSourcePaths(item);
            targetMatching.remove(item.target, t, i => {
                targetGroup.push(targetPaths[i]);
                targetPaths[i].fill = fill || targetPaths[i].fill;
                target.attr[i].fill = fill || target.attr[i].fill;
                targetPaths[i].stroke = stroke || targetPaths[i].stroke;
                target.attr[i].stroke = stroke || target.attr[i].stroke;
            });
            transforming.groupKeys.push(item);
            transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        }
        const sourceGroup = [];
        const targetGroup = [];
        for (let i = 0; i < sourcePaths.length; i++) if (!sourceMatching.deleted[i]) sourceGroup.push(sourcePaths[i]);
        for (let i = 0; i < targetPaths.length; i++) if (!targetMatching.deleted[i]) targetGroup.push(targetPaths[i]);
        transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        return transforming;
    }
    static transformMathjax(parent: Mathjax, source: MathjaxNode, target: MathjaxNode, mapping = [], auto = true) {
        mapping = processMapping(mapping);
        const sourcePaths = this.getMathjaxPaths(source, parent);
        const targetPaths = this.getMathjaxPaths(target, parent);
        const sourceMatching = new MathjaxMatching(source, sourcePaths.length);
        const targetMatching = new MathjaxMatching(target, targetPaths.length);
        const transforming = new Transforming(parent, mapping);
        const matchSourcePaths = item => {
            if (typeof item.source === "string") {
                const matched = sourceMatching.match(item.source);
                if (!matched) return undefined;
                const l = matched.element.children[matched.start].range[0];
                const r = matched.element.children[matched.start + matched.length - 1].range[1];
                item.matched = matched;
                return sourcePaths.slice(l, r);
            } else if (item.source.object) {
                const math = item.source.object;
                const subtext = item.source.subtext;
                const matched = this.findFirstSubtextInMathjax(math._.math, subtext);
                if (!matched) return undefined;
                const paths = this.getMathjaxPaths(math._.math, math);
                const l = matched.element.children[matched.start].range[0];
                const r = matched.element.children[matched.start + matched.length - 1].range[1];
                return paths.slice(l, r);
            } else {
                const math = item.source;
                return this.getMathjaxPaths(math._.math, math);
            }
        };
        const removeSourcePaths = item => {
            if (typeof item.source === "string") {
                sourceMatching.remove(item.matched);
                item.matched = undefined;
            } else if (item.source.object) {
            } else {
                const math = item.source;
                if (auto) math.remove();
            }
        };
        for (const item of mapping) {
            const sourceGroup = matchSourcePaths(item);
            if (sourceGroup === undefined) continue;
            const targetGroup = [];
            const t = targetMatching.match(item.target);
            if (t === undefined) continue;
            const fill = sameAttribute(sourceGroup, "fill");
            const stroke = sameAttribute(sourceGroup, "stroke");
            removeSourcePaths(item);
            targetMatching.forEachElement(t, element => {
                if (fill) {
                    if (targetMatching.matchedAll(t)) parent.fill(fill);
                    else if (fill !== parent.__sourceFill()) this.setAttributeInSubtree(element, "fill", fill);
                }
                if (stroke) {
                    if (targetMatching.matchedAll(t)) parent.stroke(stroke);
                    else if (stroke !== parent.__sourceStroke()) this.setAttributeInSubtree(element, "stroke", stroke);
                }
            });
            targetMatching.remove(t, i => {
                targetGroup.push(targetPaths[i]);
                targetPaths[i].fill = fill || targetPaths[i].fill;
                targetPaths[i].stroke = stroke || targetPaths[i].stroke;
            });
            transforming.groupKeys.push(item);
            transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        }
        const sourceGroup = [];
        const targetGroup = [];
        for (let i = 0; i < sourcePaths.length; i++) if (!sourceMatching.pathDeleted[i]) sourceGroup.push(sourcePaths[i]);
        for (let i = 0; i < targetPaths.length; i++) if (!targetMatching.pathDeleted[i]) targetGroup.push(targetPaths[i]);
        transforming.groups.push(this.transformPaths(parent, sourceGroup, targetGroup));
        return transforming;
    }
    static adjustMathjax(math: MathjaxNode) {
        this.mathjaxSVG.__append(math);
        const root = math.nake().children[1] as SVGGElement;
        const ibbox = root.getBBox();
        const transform = `${root.getAttribute("transform")} translate(${-ibbox.x},0)`;
        root.setAttribute("transform", transform);
        math.__remove();
    }
    static findSubtextInMathjax(math: MathjaxNode, subtext: string, limit = Infinity, matching?: MathjaxMatching) {
        const mml = new DOMParser().parseFromString(MathJax.tex2mml(String(subtext)), "text/xml").documentElement;
        function nodeContentSVG(s: SVGElement, start: number, length: number) {
            if (s.tagName === "use") {
                const unicode = s.getAttribute("data-c");
                return String.fromCodePoint(parseInt(unicode, 16));
            }
            let content = "";
            const uses = s.querySelectorAll("use");
            if (start + length > uses.length) return content;
            for (let i = start; i < start + length; i++) {
                const unicode = uses[i].getAttribute("data-c");
                content += String.fromCodePoint(parseInt(unicode, 16));
            }
            return content;
        }
        function nodeContentHTML(m: HTMLElement): string {
            function toMathLetter(char: string, style = "italic"): string {
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
        function nodeTagSVG(s: SVGElement) {
            if (s.getAttribute("data-mjx-texclass")) return s.getAttribute("data-mjx-texclass").toLowerCase();
            return s.getAttribute("data-mml-node");
        }
        function nodeTagHTML(m: HTMLElement) {
            if (m.getAttribute("data-mjx-texclass")) return m.getAttribute("data-mjx-texclass").toLowerCase();
            return m.tagName.toLowerCase();
        }
        function matchRecursively(s: SVGElement, m: HTMLElement) {
            if (matching && matching.elementDeleted.has(s)) return false;
            if (nodeTagSVG(s) !== nodeTagHTML(m)) return false;
            if (m.childElementCount === 0) {
                const mcharacter = nodeContentHTML(m);
                const length = [...mcharacter].length;
                if (s.children.length !== length) return false;
                if (matching) for (let i = 0; i < length; i++) if (matching.elementDeleted.has(s.children[i])) return false;
                const scharacter = nodeContentSVG(s, 0, length);
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
            if (m.childElementCount === 0) {
                const mcharacter = nodeContentHTML(m);
                const length = [...mcharacter].length;
                if (matching) for (let i = 0; i < length; i++) if (matching.elementDeleted.has(s.children[i + start])) return false;
                const scharacter = nodeContentSVG(s, start, length);
                return scharacter === mcharacter;
            }
            for (let i = 0; i < m.children.length; i++)
                if (!matchRecursively(s.children[i + start] as SVGElement, m.children[i] as HTMLElement)) {
                    return false;
                }
            return true;
        }
        const matched = [];
        function walk(s: SVGElement, m: HTMLElement) {
            for (let start = 0; start < s.children.length; start++) {
                if (m.children.length === 1) {
                    const m_ = m.children[0] as HTMLElement;
                    if (nodeTagSVG(s) === nodeTagHTML(m_) && match(s, m_, start)) {
                        matched.push({
                            element: s,
                            start,
                            length: m_.children.length || [...nodeContentHTML(m_)].length,
                        });
                        if (matched.length >= limit) return;
                    }
                } else {
                    if (match(s, m, start)) {
                        matched.push({
                            element: s,
                            start,
                            length: m.children.length || [...nodeContentHTML(m)].length,
                        });
                        if (matched.length >= limit) return;
                    }
                }
            }
            for (let i = 0; i < s.children.length; i++) {
                walk(s.children[i] as SVGElement, m);
                if (matched.length >= limit) return;
            }
        }
        walk(math.nake().children[1] as SVGElement, mml);
        return matched;
    }
    static findFirstSubtextInMathjax(math: MathjaxNode, subtext: string, matching?: MathjaxMatching) {
        return this.findSubtextInMathjax(math, subtext, 1, matching)[0];
    }
    static setAttributeInSubtree(root: Element, key: string, value: string) {
        root.setAttribute(key, value);
        for (let i = 0; i < root.children.length; i++) this.setAttributeInSubtree(root.children[i], key, value);
    }
    static removeAttributeInSubtree(root: Element, key: string) {
        root.removeAttribute(key);
        for (let i = 0; i < root.children.length; i++) this.removeAttributeInSubtree(root.children[i], key);
    }
}

function sameAttribute(array: Array<any>, key: string) {
    if (array.length === 0) return undefined;
    for (let i = 1; i < array.length; i++) if (array[i][key] !== array[0][key]) return undefined;
    return array[0][key];
}

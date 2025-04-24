import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { SD2DNode } from "@/Node/SD2DNode";
import { MathAtom } from "@/Node/Text/MathAtom";
import { createRenderNode, RenderNode } from "@/Renderer/RenderNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { PathPen } from "@/Utility/PathPen";

let globalMathjax = undefined;

/**
 * Create a mathjax render node.
 * The x coord at SVG = The x coord at Mathjax - OffsetX
 * The y coord at SVG = The y coord at Mathjax - OffsetY
 * @param {Mathjax} node The parent of the mathjax render node.
 * @param {string | SVGElement} text The content of the mathjax.
 * @returns {RenderNode}
 */
function createMathjaxRenderNode(node, text) {
    let svg = text;
    if (Check.isNumberOrString(text)) svg = MathJax.tex2svg(text).children[0];
    svg.setAttribute("fill", svg.children[1].getAttribute("fill"));
    svg.setAttribute("stroke", svg.children[1].getAttribute("stroke"));
    svg.children[1].removeAttribute("fill");
    svg.children[1].removeAttribute("stroke");
    const math = createRenderNode(node, node._.layer, svg);
    math.setAttribute = function (key, value) {
        if (key === "x") SVGNode.prototype.setAttribute.call(this, key, value - this.offsetX);
        else if (key === "y") SVGNode.prototype.setAttribute.call(this, key, value - this.offsetY);
        else SVGNode.prototype.setAttribute.call(this, key, value);
    };
    math.getAttribute = function (key) {
        if (key === "x") return +SVGNode.prototype.getAttribute.call(this, key) + this.offsetX;
        else if (key === "y") return +SVGNode.prototype.getAttribute.call(this, key) + this.offsetY;
        return SVGNode.prototype.getAttribute.call(this, key);
    };
    math.offsetX = 0;
    math.offsetY = 0;
    return math;
}

function createMathjax() {
    if (globalMathjax === undefined) {
        globalMathjax = createRenderNode(undefined, svg(), "g");
        globalMathjax.setAttribute("opacity", 0);
        globalMathjax.setAttribute("font-size", 20);
    }
}

/**
 * @param {RenderNode} math
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function getBox(math) {
    createMathjax();
    globalMathjax.append(math);
    const box = globalMathjax.nake().getBBox();
    math.nake().remove();
    return box;
}

/**
 * @param {SVGElement} element
 * @returns {SVGElement}
 */
function cloneMathjax(element) {
    let root = Dom.deepClone(element);
    while (Dom.parent(element)) {
        const parent = Dom.parent(element);
        const parentClone = Dom.clone(parent);
        if (Dom.tagName(parent) === "svg") {
            const defsClone = Dom.deepClone(parent.children[0]);
            parentClone.append(defsClone);
            parentClone.append(root);
            root = parentClone;
            break;
        } else {
            parentClone.append(root);
            root = parentClone;
            element = parent;
        }
    }
    return root;
}

export function Mathjax(target, text) {
    SD2DNode.call(this, target);

    this.type("Mathjax");

    this.vars.merge({
        x: 0,
        y: 0,
        width20: 0,
        height20: 0,
        text: "",
        fontSize: 20,
        elements: [],
        stroke: C.black,
        fill: C.black,
    });

    this.vars.associate("x", mathjaxUpdate(this, "x", Interp.numberInterp));
    this.vars.associate("y", mathjaxUpdate(this, "y", Interp.numberInterp));
    this.vars.associate("fill", mathjaxUpdate(this, "fill", Interp.colorInterp));
    this.vars.associate("stroke", mathjaxUpdate(this, "stroke", Interp.colorInterp));
    this.vars.associate("fontSize", mathjaxUpdate(this, "font-size", Interp.numberInterp));

    this._.layer.setAttribute("font-size", 20);
    this._.math = undefined;
    this._.transforming = [];

    if (text !== undefined) this.math(text);

    this._.BASE_MATHJAX = true;
}

Mathjax.prototype = {
    ...SD2DNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    fontSize: Factory.handlerLowPrecise("fontSize"),
    width: mathjaxLength("width"),
    height: mathjaxLength("height"),
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    length() {
        return this.vars.elements.length;
    },
    color() {
        const args = arguments;
        switch (args.length) {
            case 0:
                return { main: this.fill(), stroke: this.stroke() };
            case 1:
                this.fill(args[0].main || args[0]);
                this.stroke(args[0].border || args[0]);
                return this;
            case 2:
                this.element(args[0]).color(args[1]);
                return this;
        }
        ErrorLauncher.invalidArguments();
    },
    element(id) {
        return this.vars.elements[id];
    },
    text() {
        return this.vars.text;
    },
    intValue() {
        const i = Math.floor(+this.text());
        if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(this.text());
        return i;
    },
    math(text) {
        if (text === undefined) return this.text();
        text = String(text);
        if (text.startsWith("$")) text = text.slice(1, -1);
        this.vars.text = text;
        const newMath = createMathjaxRenderNode(this, text);
        const oldMath = this._.math;
        this._.math = newMath;
        this._.transforming = oldMath ? [oldMath] : [];
        updateMath(this, newMath);
        buildMathAtom(this);
        oldMath?.remove();
        return this;
    },
    transformMath(text, relations) {
        text = String(text);
        if (text.startsWith("$")) text = text.slice(1, -1);
        this.vars.text = text;
        const newMath = createMathjaxRenderNode(this, text);
        const oldMath = this._.math;
        this._.math = newMath;
        this._.transforming = oldMath ? [oldMath] : [];
        updateMath(this, newMath);
        transformMathjax(this, oldMath, newMath, relations);
        buildMathAtom(this);
        oldMath?.remove();
        return this;
    },
    transformMathFrom(text, others, relations) {
        text = String(text);
        if (text.startsWith("$")) text = text.slice(1, -1);
        this.vars.text = text;
        const newMath = createMathjaxRenderNode(this, text);
        const oldMath = this._.math;
        const otherMaths = others.map(other => other._.math);
        this._.math = newMath;
        this._.transforming = oldMath ? [oldMath, ...otherMaths] : otherMaths;
        updateMath(this, newMath);
        transformMathjaxFrom(this, oldMath, newMath, otherMaths, relations);
        buildMathAtom(this);
        others.forEach(other => other.startAnimate(this).remove());
        oldMath?.remove();
        return this;
    },
    createMath(id) {
        const element = this.element(id);
        const created = new Mathjax(svg());
        const newMath = createMathjaxRenderNode(created, cloneMathjax(element._.math.nake()));
        created._.math = newMath;
        updateMathFrom(created, newMath, this);
        buildMathAtom(created);
        return created;
    },
};

/**
 * @param {Array<SVGPathElement>} paths
 * @returns {Array<SVGPathElement>}
 */
function pathNotDeleted(paths) {
    return paths.filter(path => !path.isDeleted);
}

/**
 *
 * @param {Mathjax} node
 * @param {RenderNode} oldMath
 * @param {RenderNode} newMath
 * @param {{[key: number]: number}} relations
 */
function transformMathjax(node, oldMath, newMath, relations) {
    transformMath(node, oldMath, newMath);
    const [oldPaths, oldAtoms] = parseMathjax(oldMath, true);
    const [newPaths, newAtoms] = parseMathjax(newMath, false);
    for (const source in relations) {
        const target = relations[source];
        if (!oldAtoms[+source]) continue;
        if (!newAtoms[+target]) continue;
        transformPath(node, oldMath, oldAtoms[+source], newMath, newAtoms[+target]);
        oldAtoms[+source].forEach(path => (path.isDeleted = true));
        newAtoms[+target].forEach(path => (path.isDeleted = true));
    }
    transformPath(node, oldMath, pathNotDeleted(oldPaths), newMath, pathNotDeleted(newPaths));
}

/**
 * @param {Mathjax} node
 * @param {RenderNode} oldMath
 * @param {RenderNode} newMath
 * @param {Array<RenderNode>} otherMaths
 * @param {{[key: number]: number}} relations
 */
function transformMathjaxFrom(node, oldMath, newMath, otherMaths, relations) {
    transformMath(node, oldMath, newMath);
    const otherPaths = [];
    for (const otherMath of otherMaths) {
        transformMath(node, otherMath, newMath);
        otherPaths.push(parseMathjax(otherMath, true));
    }
    const [newPaths, newAtoms] = parseMathjax(newMath, false);
    for (const source in relations) {
        const A = +source - 1;
        const B = +relations[source];
        if (!otherPaths[A] || !newAtoms[B]) continue;
        transformPath(node, otherMaths[A], otherPaths[A][0], newMath, newAtoms[B]);
        newAtoms[B].forEach(path => (path.isDeleted = true));
        otherPaths[A].isDeleted = true;
    }

    for (let i = 0; i < otherPaths.length; i++) {
        if (otherPaths[i].isDeleted) continue;
        transformPath(node, otherMaths[i], otherPaths[i][0], newMath, pathNotDeleted(newPaths));
    }
    if (oldMath) {
        const [oldPaths, _] = parseMathjax(oldMath, true);
        transformPath(node, oldMath, pathNotDeleted(oldPaths), newMath, pathNotDeleted(newPaths));
    }
}

/**
 *
 * @param {SVGUseElement | SVGRectElement} current
 * @param {{a: number, b: number, c: number, d: number, e: number, f: number}} matrix
 * @param {SVGElement} defs
 * @returns {SVGPathElement}
 */
function createPath(current, matrix, defs) {
    const path = Dom.createSVGElement("path");
    path.setAttribute("transform", `matrix(${matrix.a}, ${matrix.b}, ${matrix.c}, ${matrix.d}, ${matrix.e}, ${matrix.f})`);
    if (Dom.tagName(current) === "rect") {
        const x = +current.getAttribute("x");
        const y = +current.getAttribute("y");
        const mx = +current.getAttribute("width") + x;
        const my = +current.getAttribute("height") + y;
        const d = new PathPen().MoveTo(x, y).LinkTo(mx, y).LinkTo(mx, my).LinkTo(x, my).toString();
        path.setAttribute("d", d);
    } else if (Dom.tagName(current) === "use") {
        const href = current.getAttribute("xlink:href");
        const data = current.getAttribute("data-c");
        const ssrc = defs.querySelector(href);
        path.setAttribute("d", ssrc.getAttribute("d"));
        path.character = data;
    }
    return path;
}

/**
 * @param {{a: number, b: number, c: number, d: number, e: number, f: number}} matrix1
 * @param {{a: number, b: number, c: number, d: number, e: number, f: number}} matrix2
 * @returns {{a: number, b: number, c: number, d: number, e: number, f: number}}
 */
function multiply(matrix1, matrix2) {
    return {
        a: matrix1.a * matrix2.a + matrix1.c * matrix2.b,
        b: matrix1.b * matrix2.a + matrix1.d * matrix2.b,
        c: matrix1.a * matrix2.c + matrix1.c * matrix2.d,
        d: matrix1.b * matrix2.c + matrix1.d * matrix2.d,
        e: matrix1.a * matrix2.e + matrix1.c * matrix2.f + matrix1.e,
        f: matrix1.b * matrix2.e + matrix1.d * matrix2.f + matrix1.f,
    };
}

/**
 * @param {SVGElement} element
 * @returns {boolean}
 */
function isMathAtom(element) {
    return element.getAttribute("data-mml-node") === "TeXAtom";
}

/**
 * @param {RenderNode} math
 * @param {boolean} flatten If flatten the uses/rects to paths.
 * @returns {[Array<SVGPathElement>, {[key: number]: Array<SVGPathElement>}]}
 */
function parseMathjax(math, flatten) {
    const defs = math.nake().children[0];
    const root = math.nake().children[1].children[0];
    const paths = [];
    const atoms = {};
    const removed = [];
    let currentAtomID = 0;
    let allocatedAtomID = 0;
    function dfs(current, matrix, fill, stroke) {
        for (let i = 0; i < current.transform.baseVal.length; i++) matrix = multiply(matrix, current.transform.baseVal[i].matrix);
        if (current.getAttribute("fill")) fill = current.getAttribute("fill");
        if (current.getAttribute("stroke")) stroke = current.getAttribute("stroke");
        if (!Dom.tagName(current)) return;
        if (isMathAtom(current)) atoms[(currentAtomID = ++allocatedAtomID)] = [];
        const atomID = currentAtomID;
        if (Dom.tagName(current) === "defs") return;
        if (Dom.tagName(current) === "path") return;
        if (Dom.tagName(current) === "rect" || Dom.tagName(current) === "use") {
            const path = createPath(current, matrix, defs);
            if (fill) path.setAttribute("fill", fill);
            if (stroke) path.setAttribute("stroke", stroke);
            if (flatten) root.append(path);
            if (flatten) removed.push(current);
            if (currentAtomID) atoms[currentAtomID].push(path);
            paths.push(path);
            return;
        }
        for (let child of current.children) dfs(child, matrix, fill, stroke);
        currentAtomID = atomID;
    }
    dfs(root, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    removed.forEach(use => use.remove());
    return [paths, atoms];
}

function transformMath(node, oldMath, newMath) {
    const l = node.delay();
    const r = node.delay() + node.duration();
    if (oldMath && newMath) {
        new Action(l, r, oldMath.getAttribute("width"), newMath.getAttribute("width"), Interp.exLengthInterp(oldMath, "width"), oldMath, "width");
        new Action(l, r, oldMath.getAttribute("height"), newMath.getAttribute("height"), Interp.exLengthInterp(oldMath, "height"), oldMath, "height");
        new Action(l, r, Cast.castToViewBox(oldMath.getAttribute("viewBox")), Cast.castToViewBox(newMath.getAttribute("viewBox")), Interp.boxInterp(oldMath, "viewBox"), oldMath, "viewBox");
        new Action(l, r, oldMath.getAttribute("x"), newMath.getAttribute("x") + oldMath.offsetX, Interp.numberInterp(oldMath, "x"), oldMath, "x");
        new Action(l, r, oldMath.getAttribute("y"), newMath.getAttribute("y") + oldMath.offsetY, Interp.numberInterp(oldMath, "y"), oldMath, "y");
        new Action(l, r, oldMath.getAttribute("font-size"), newMath.getAttribute("font-size"), Interp.numberInterp(oldMath, "font-size"), oldMath, "font-size");
    }
}

function fillOldPaths(oldPaths, newPaths, oldRoot) {
    const length = newPaths.length;
    const tmpPaths = [];
    const add = length - oldPaths.length;
    const gap = Math.floor(oldPaths.length / add);
    let currentAdd = 0;
    if (oldPaths.length === 0) {
        for (let i = newPaths.length - 1; i >= 0; i--) {
            const matrix = newPaths[i].transform.baseVal[0].matrix;
            const path = Dom.createSVGElement("path");
            path.setAttribute("d", newPaths[i].getAttribute("d"));
            path.setAttribute("transform", `matrix(0,0,0,0,${matrix.e},${matrix.f})`);
            oldRoot.append(path);
            tmpPaths.push(path);
        }
    } else if (gap > 0) {
        for (let i = oldPaths.length - 1; i >= 0; i--) {
            if ((oldPaths.length - 1 - i) % gap === 0 && currentAdd < add) {
                const path = Dom.createSVGElement("path");
                path.setAttribute("d", oldPaths[i].getAttribute("d"));
                path.setAttribute("transform", oldPaths[i].getAttribute("transform"));
                path.character = oldPaths[i].character;
                oldRoot.append(path);
                tmpPaths.push(path);
                currentAdd++;
            }
            tmpPaths.push(oldPaths[i]);
        }
    } else {
        const pile = Math.ceil(add / oldPaths.length);
        for (let i = oldPaths.length - 1; i >= 0; i--) {
            for (let j = 1; j <= pile && currentAdd < add; j++) {
                const path = Dom.createSVGElement("path");
                path.setAttribute("d", oldPaths[i].getAttribute("d"));
                path.setAttribute("transform", oldPaths[i].getAttribute("transform"));
                path.character = oldPaths[i].character;
                oldRoot.append(path);
                tmpPaths.push(path);
                currentAdd++;
            }
            tmpPaths.push(oldPaths[i]);
        }
    }
    return tmpPaths.reverse();
}

function fillNewPaths(newPaths, oldPaths) {
    const length = oldPaths.length;
    const tmpPaths = [];
    const add = length - newPaths.length;
    const gap = Math.floor(newPaths.length / add);
    let currentAdd = 0;
    if (gap > 0) {
        for (let i = newPaths.length - 1; i >= 0; i--) {
            if ((newPaths.length - 1 - i) % gap === 0 && currentAdd < add) {
                tmpPaths.push(newPaths[i]);
                currentAdd++;
            }
            tmpPaths.push(newPaths[i]);
        }
    } else {
        const pile = Math.ceil(add / newPaths.length);
        for (let i = newPaths.length - 1; i >= 0; i--) {
            for (let j = 1; j <= pile && currentAdd < add; j++) {
                tmpPaths.push(newPaths[i]);
                currentAdd++;
            }
            tmpPaths.push(newPaths[i]);
        }
    }
    return tmpPaths.reverse();
}

/**
 *
 * @param {Mathjax} node
 * @param {RenderNode} oldMath
 * @param {Array<SVGElement>} oldPaths
 * @param {RenderNode} newMath
 * @param {Array<SVGElement>} newPaths
 */
function transformPath(node, oldMath, oldPaths, newMath, newPaths) {
    const oldRoot = oldMath.nake().children[1].children[0];
    if (oldPaths.length < newPaths.length) oldPaths = fillOldPaths(oldPaths, newPaths, oldRoot);
    if (oldPaths.length > newPaths.length) newPaths = fillNewPaths(newPaths, oldPaths);
    const l = node.delay();
    const r = node.delay() + node.duration();
    oldPaths.forEach((oldPath, i) => {
        const newPath = newPaths[i];
        if (!newPath) {
            if (true) {
                const source = oldPath.transform.baseVal[0].matrix;
                const target = { a: 0, b: 0, c: 0, d: 0, e: source.e, f: source.f };
                new Action(l, r, source, target, Interp.matrixInterp(oldPath, "transform"), oldPath, "transform");
            }
        } else {
            if (true) {
                const source = oldPath.transform.baseVal[0].matrix;
                const target = newPath.transform.baseVal[0].matrix;
                new Action(l, r, source, target, Interp.matrixInterp(oldPath, "transform"), oldPath, "transform");
            }
            if (!oldPath.character || oldPath.character !== newPath.character) {
                const source = oldPath.getAttribute("d");
                const target = newPath.getAttribute("d");
                new Action(l, r, source, target, Interp.pathInterp(oldPath, "d"), oldPath, "d");
            }
        }
    });
}

/**
 * @param {Mathjax} node
 */
function buildMathAtom(node) {
    for (let i = 0; i < node.length(); i++) node.eraseChild(i);
    const math = node._.math;
    const elements = [];
    const root = math.nake().children[1].children[0];
    const atoms = [root, ...root.querySelectorAll("g[data-mml-node='TeXAtom']")];
    atoms.forEach((fragment, index) => {
        const child = new MathAtom(node).onExit(() => {});
        child._.math = createRenderNode(child, undefined, fragment);
        elements.push(child);
        node.childAs(index, child);
    });
    node.vars.elements = elements;
}

/**
 * @param {Mathjax} node
 * @param {RenderNode} math
 */
function updateMath(node, math) {
    const box = getBox(math);
    node.vars.width20 = box.width;
    node.vars.height20 = box.height;
    math.setAttribute("x", node.x());
    math.setAttribute("y", node.y());
    math.setAttribute("fill", node.fill());
    math.setAttribute("stroke", node.stroke());
    math.setAttribute("font-size", node.fontSize());
}

/**
 * @param {Mathjax} node
 * @param {RenderNode} math
 * @param {Mathjax} from
 */
function updateMathFrom(node, math, from) {
    math.setAttribute("x", from.x());
    math.setAttribute("y", from.y());
    math.setAttribute("fill", node.fill());
    math.setAttribute("stroke", node.stroke());
    math.setAttribute("font-size", node.fontSize());
    const box = getBox(math);
    math.offsetX = box.x - from.x();
    math.offsetY = box.y - from.y();
    node.vars.width20 = box.width;
    node.vars.height20 = box.height;
    node.vars.x = box.x;
    node.vars.y = box.y;
}

/**
 * Watch the attribute change of Mathjax. If the attribute is changed, then launch actions for math and transforming objects.
 * @param {Mathjax} node
 * @param {string} key
 * @param {(attrs: any, key: string) => (t: number) => void} interp
 * @param {(svg: SVGElement) => any} pipe
 * @returns
 */
function mathjaxUpdate(node, key, interp) {
    return function (newValue, oldValue) {
        const math = node._.math;
        const transforming = node._.transforming;
        const l = node.delay();
        const r = node.delay() + node.duration();
        const objects = [...transforming];
        if (math) objects.push(math);
        for (const object of objects) {
            new Action(l, r, oldValue, newValue, interp(object, key), object, key);
        }
    };
}

function mathjaxLength(key) {
    return function (length) {
        const length20 = this.vars[`${key}20`];
        const fontSize = this.fontSize();
        if (length === undefined) return (length20 * fontSize) / 20;
        if (length20 === 0) return this;
        this.fontSize((20 * length) / length20);
        return this;
    };
}

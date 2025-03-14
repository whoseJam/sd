import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
// import { ThreeNode } from "@/Renderer/Three/ThreeNode";
import { Check } from "@/Utility/Check";

function defineArrows() {
    Snap(svg().nake()).append(
        Snap.parse(`
    <marker id="arrow" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path>
    </marker>`)
    );
    Snap(svg().nake()).append(
        Snap.parse(`
    <marker id="arrowReverse" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" stroke="context-stroke" fill="context-stroke"></path>
    </marker>`)
    );
}

function updateDivViewBox(box) {
    const view = div();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scaleX = width / box.width;
    const scaleY = height / box.height;
    const scale = Math.min(scaleX, scaleY);
    const translateX = (width - box.width) / 2 - box.x * scale;
    const translateY = (height - box.height) / 2 - box.y * scale;
    view.setAttribute("transform", `translate(${translateX}px, ${translateY}px) scale(${scale})`);
    view.setAttribute("width", `${box.width}px`);
    view.setAttribute("height", `${box.height}px`);
}

function updateSVGViewBox(box) {
    const view = svg();
    view.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
}

function updateThreeViewBox(box) {
    const view = three().nake();
    const aspect = window.innerWidth / window.innerHeight;
    const scaleX = window.innerWidth / box.width;
    const scaleY = window.innerHeight / box.height;
    const midPoint = box.width / box.height;
    if (scaleX > scaleY) {
        view.camera.left = -view.frustumSize * aspect;
        view.camera.right = view.frustumSize * aspect;
        view.camera.top = view.frustumSize;
        view.camera.bottom = -view.frustumSize;
    } else {
        view.camera.left = -midPoint * view.frustumSize;
        view.camera.right = midPoint * view.frustumSize;
        view.camera.top = (midPoint * view.frustumSize) / aspect;
        view.camera.bottom = (-midPoint * view.frustumSize) / aspect;
    }
    view.renderer.setSize(window.innerWidth, window.innerHeight);
    view.renderer.setPixelRatio(window.devicePixelRatio);
    view.camera.updateProjectionMatrix();
}

function updateWindowRate(box) {
    const view = svg();
    const width = view.nake().getBoundingClientRect().width;
    const height = view.nake().getBoundingClientRect().height;
    if (width / box.width > height / box.height) window.RATE = height / box.height;
    else window.RATE = width / box.width;
}

export class Root {
    static svg = undefined;

    static init() {
        // screen delta / window.RATE = svg delta
        this.viewBox = { x: 0, y: 0, width: 1200, height: 600 };
        window.RATE = 1;

        if (true) {
            this.svg = new HTMLNode(undefined, document.body, "div");
            this.svg.setAttribute("width", "100%");
            this.svg.setAttribute("height", "100%");
            this.svg.setAttribute("position", "absolute");
            this.svg = new SVGNode(undefined, this.svg, "svg");
            this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            this.svg.setAttribute("width", "100%");
            this.svg.setAttribute("height", "100%");
            defineArrows();
        }

        if (true) {
            this.div = new HTMLNode(undefined, document.body, "div");
            this.div.setAttribute("width", "100vw");
            this.div.setAttribute("height", "100vh");
            this.div.setAttribute("overflow", "hidden");
            this.div.setAttribute("position", "absolute");
            this.div.setAttribute("pointer-events", "none");
            this.div = this.div.append("div");
            this.div.setAttribute("width", `${this.viewBox.width}px`);
            this.div.setAttribute("height", `${this.viewBox.height}px`);
            window.addEventListener("resize", () => {
                updateDivViewBox(this.viewBox);
            });
        }
        if (window.self === window.top) {
            updateSVGViewBox(this.viewBox);
            updateDivViewBox(this.viewBox);
            updateWindowRate(this.viewBox);
        } else {
            this.svg.setAttribute("opacity", 0);
            this.div.setAttribute("opacity", 0);
        }
    }

    static setViewBox(x, y, width, height, rate) {
        /*
            |-----------W-----------|
            X           cX          mX
        Y   +-----------+-----------+  -
            |   x       cx      mx  |  |
            |   +-------+-------+   |  |
            |   |       |       |   |  |
            |   |       |       |   |  |
        cY  |   +-------+-------+   +  H
            |   |       |       |   |  |
            |   |       |       |   |  |
            |   +-------+-------+   |  |
            |                       |  |
        mY  +-----------+-----------+  -
        
        */
        const cx = x + width / 2;
        const cy = y + height / 2;
        const mx = x + width;
        const my = y + height;
        const X = x + ((x - cx) * (rate - 1)) / 2;
        const Y = y + ((y - cy) * (rate - 1)) / 2;
        if (!Check.isValidNumber(X)) return;
        if (!Check.isValidNumber(Y)) return;
        const mX = mx + ((mx - cx) * (rate - 1)) / 2;
        const mY = my + ((my - cy) * (rate - 1)) / 2;
        const W = mX > X ? mX - X : 1200;
        const H = mY > Y ? my - Y : 600;
        this.viewBox = { x: X, y: Y, width: W, height: H + 1 };
        updateSVGViewBox(this.viewBox);
        updateDivViewBox(this.viewBox);
        updateWindowRate(this.viewBox);
        this.svg.setAttribute("opacity", 1);
        this.div.setAttribute("opacity", 1);
    }
}

export function svg() {
    return Root.svg;
}

export function div() {
    return Root.div;
}

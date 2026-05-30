export class Dom {
    static createElement(tag: string, id?: string | number): HTMLElement {
        const element = document.createElement(tag);
        if (id !== undefined) element.setAttribute("id", String(id));
        return element;
    }
    static createElementAndAppendToBody(tag: string, id?: string | number): HTMLElement {
        const element = Dom.createElement(tag, id);
        document.body.append(element);
        return element;
    }
    static createSVGElement(tag: string, id?: string | number): SVGElement {
        const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        if (id !== undefined) element.setAttribute("id", String(id));
        return element;
    }
    static getByID(id: string | number): Element {
        return document.getElementById(String(id));
    }
    static getHTMLByID(id: string | number): HTMLElement {
        return this.getByID(id) as HTMLElement;
    }
    static getSVGByID(id: string | number): SVGElement {
        return this.getByID(id) as SVGElement;
    }
    static tagName(element: Element): string {
        return element.tagName;
    }
    static parent(element: Element): Element {
        return element.parentElement;
    }
    static addEventListener(element: Element, event: string, callback: EventListenerOrEventListenerObject): void {
        element.addEventListener(event, callback);
    }
    static removeEventListener(element: Element, event: string, callback: EventListenerOrEventListenerObject): void {
        element.removeEventListener(event, callback);
    }
    static clone(element: Element): Element {
        return element.cloneNode() as Element;
    }
    static deepClone(element: Element) {
        const ans = this.clone(element);
        for (let child of element.children) ans.append(this.deepClone(child));
        return ans;
    }
    static matrixEqual(a: SVGMatrix, b: SVGMatrix): boolean {
        return a.a === b.a && a.b === b.b && a.c === b.c && a.d === b.d && a.e === b.e && a.f === b.f;
    }
}

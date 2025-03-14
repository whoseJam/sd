export class Dom {
    static createElement(tag: string, id: number | string): HTMLElement;
    static createElementAndAppendToBody(tag: string, id: number | string): HTMLElement;
    static createSVGElement(tag: string, id: number | string): SVGElement;
    static getByID(id: number | string): Element;
    static tagName(element: Element): string;
    static parent(element: Element): Element;
    static addEventListener(element: Element, event: string, callback: any): void;
    static removeEventListener(element: Element, event: string, callback: any): void;
    static clone(element);
    static deepClone(element);
}

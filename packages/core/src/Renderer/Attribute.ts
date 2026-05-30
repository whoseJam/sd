import { Color as C } from "@/Utility/Color";

type Context = Record<string, any>;

const STYLE_KEY_MAP = {
    "pointer-events": true,
    "position": true,
    "min-width": true,
    "min-height": true,
    "display": true,
    "justify-content": true,
    "align-items": true,
    "border-radius": true,
    "transform-origin": true,
    "width": { svg: false, html: true },
    "height": { svg: false, html: true },
    "opacity": { svg: false, html: true },
};

export function isStyleKey(type: "svg" | "html", key: string) {
    const style = STYLE_KEY_MAP[key];
    if (style) {
        if (typeof style === "object") return style[type];
        return true;
    }
    return false;
}

class AttributeConverter {
    aliasKey: string;
    default: string;
    toString: (object: any, context?: Context) => string;
    constructor(aliasKey: string, default_: string, toString: (object: any, context?: Context) => string) {
        this.aliasKey = aliasKey;
        this.default = default_;
        this.toString = toString;
    }
}

const ATTRIBUTE_KEY_MAP: Record<string, AttributeConverter> = {
    rx: new AttributeConverter("rx", undefined, value => (value === 0 ? undefined : `${value}`)),
    ry: new AttributeConverter("ry", undefined, value => (value === 0 ? undefined : `${value}`)),
    opacity: new AttributeConverter("opacity", undefined, value => (value === 1 ? undefined : `${value}`)),
    floodColor: new AttributeConverter("flood-color", undefined, color => C.toString(color)),
    floodOpacity: new AttributeConverter("flood-opacity", undefined, value => (value === 1 ? undefined : `${value}`)),
    fill: new AttributeConverter("fill", C.white, color => C.toString(color)),
    fillOpacity: new AttributeConverter("fill-opacity", undefined, value => `${value}`),
    stroke: new AttributeConverter("stroke", C.black, color => C.toString(color)),
    strokeOpacity: new AttributeConverter("stroke-opacity", undefined, value => `${value}`),
    strokeWidth: new AttributeConverter("stroke-width", undefined, value => `${value}`),
    fontWeight: new AttributeConverter("font-weight", undefined, value => value),
    fontFamily: new AttributeConverter("font-family", undefined, value => value),
    fontSize: new AttributeConverter("font-size", undefined, value => `${value}`),
    scale: new AttributeConverter("transform", undefined, (value: [number, number], context: Context) => {
        context.scale = value;
        const scale = context.scale ?? [1, 1];
        const translate = context.translate ?? [0, 0];
        const rotate = context.rotate ?? 0;
        return `matrix(${scale[0]}, 0, 0, ${scale[1]}, ${translate[0]}, ${translate[1]}) rotate(${rotate})`;
    }),
    rotate: new AttributeConverter("transform", undefined, (value: any, context: Context) => {
        context.rotate = value;
        const scale = context.scale ?? [1, 1];
        const translate = context.translate ?? [0, 0];
        const rotate = context.rotate ?? 0;
        return `matrix(${scale[0]}, 0, 0, ${scale[1]}, ${translate[0]}, ${translate[1]}) rotate(${rotate})`;
    }),
    translate: new AttributeConverter("transform", undefined, (value: [number, number], context: Context) => {
        context.translate = value;
        const scale = context.scale ?? [1, 1];
        const translate = context.translate ?? [0, 0];
        const rotate = context.rotate ?? 0;
        return `matrix(${scale[0]}, 0, 0, ${scale[1]}, ${translate[0]}, ${translate[1]}) rotate(${rotate})`;
    }),
    transformOrigin: new AttributeConverter(
        "transform-origin",
        undefined,
        (value: [number, number]) => `${value[0]} ${value[1]}`
    ),
    strokeDashArray: new AttributeConverter("stroke-dasharray", undefined, (value: number | Array<number>) => {
        if (typeof value === "number") return `${value} ${value}`;
        let dashed = 0;
        for (let i = 1; i < value.length; i += 2) dashed += value[i];
        if (dashed > 0) return value.join(" ");
        return undefined;
    }),
    strokeDashOffset: new AttributeConverter("stroke-dashoffset", undefined, value =>
        value === 0 ? undefined : `${value}`
    ),
    strokeLineCap: new AttributeConverter("stroke-linecap", undefined, value => (value === "butt" ? undefined : value)),
    strokeLineJoin: new AttributeConverter("stroke-linejoin", undefined, value =>
        value === "miter" ? undefined : value
    ),
    markerStart: new AttributeConverter("marker-start", undefined, value => (value === "" ? undefined : value)),
    markerMid: new AttributeConverter("marker-mid", undefined, value => (value === "" ? undefined : value)),
    markerEnd: new AttributeConverter("marker-end", undefined, value => (value === "" ? undefined : value)),
    result: new AttributeConverter("result", undefined, value => (value === "" ? undefined : value)),
    filter: new AttributeConverter("filter", undefined, value => (value === "" ? undefined : value)),
    colorInterpolationFilters: new AttributeConverter("color-interpolation-filters", undefined, value =>
        value === "sRGB" ? undefined : value
    ),
    dx: new AttributeConverter("dx", undefined, value => (value === 0 ? undefined : `${value}`)),
    dy: new AttributeConverter("dy", undefined, value => (value === 0 ? undefined : `${value}`)),
    in: new AttributeConverter("in", undefined, value => (value === "SourceGraphic" ? undefined : value)),
    in2: new AttributeConverter("in2", undefined, value => (value === "SourceGraphic" ? undefined : value)),
};

export function setAttribute(type: "svg" | "html", element: Element, key: string, value: any) {
    const attribute = ATTRIBUTE_KEY_MAP[key];
    if (!attribute) {
        element.setAttribute(key, value);
        return;
    }
    const element_ = element as (SVGElement | HTMLElement) & { __setAttributeContext: Record<string, any> };
    if (element_.__setAttributeContext === undefined) element_.__setAttributeContext = {};
    const value_ = value === undefined ? undefined : attribute.toString(value, element_.__setAttributeContext);
    const key_ = attribute.aliasKey;
    if (isStyleKey(type, key_)) {
        if (value_ !== undefined) element_.style[key_] = value_;
        else if (attribute.default) element_.style[key_] = attribute.default;
        else element_.style.removeProperty(key_);
        if (key_ === "transform-origin") {
            element_.style["transform-box"] = "fill-box";
        }
    } else {
        if (value_ !== undefined) element.setAttribute(key_, value_);
        else if (attribute.default) element.setAttribute(key_, attribute.default);
        else element.removeAttribute(key_);
    }
}

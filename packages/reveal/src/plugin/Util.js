const DEFAULT_STYLES = [
    "style",
    "width",
    "height"
];

export function ReplaceElement(source, target) {
    if (arguments.length === 3) {
        ReplaceElement(arguments[1], arguments[2]);
        return;
    }
    const parent = source.parentNode;
    target.className = source.className;
    CopyStyles(source, target);
    CopyAttributes(source, target, ["data-fragment-index"]);
    parent.insertBefore(target, source.previousSibling);
    parent.removeChild(source);
}

export function CopyAttributes(source, target, attributes = []) {
    for (let attribute of attributes) {
        const value = source.getAttribute(attribute);
        if (value) target.setAttribute(attribute, value);
    }
}

export function CopyStyles(source, target, styles = DEFAULT_STYLES) {
    CopyAttributes(source, target, styles);
}
const DEFAULT_STYLES = ["style", "width", "height"];

export function ReplaceElement(source: Element, target: Element): void {
  const parent = source.parentNode;
  if (!parent) return;
  target.className = source.className;
  CopyStyles(source, target);
  CopyAttributes(source, target, ["data-fragment-index"]);
  parent.insertBefore(target, source.previousSibling);
  parent.removeChild(source);
}

export function CopyAttributes(
  source: Element,
  target: Element,
  attributes: string[] = [],
): void {
  for (const attribute of attributes) {
    const value = source.getAttribute(attribute);
    if (value) target.setAttribute(attribute, value);
  }
}

export function CopyStyles(
  source: Element,
  target: Element,
  styles: string[] = DEFAULT_STYLES,
): void {
  CopyAttributes(source, target, styles);
}

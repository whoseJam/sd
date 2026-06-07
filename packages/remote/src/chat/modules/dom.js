export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function el(tag, options = {}, ...children) {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text != null) node.textContent = options.text;
  if (options.html != null) node.innerHTML = options.html;
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      node.setAttribute(key, value);
    }
  }
  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) {
      node.addEventListener(event, handler);
    }
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    node.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child,
    );
  }
  return node;
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

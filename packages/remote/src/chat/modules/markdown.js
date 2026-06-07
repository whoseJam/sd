// marked.js loaded from CDN in index.html.

export function renderMarkdown(text) {
  if (typeof window.marked === "undefined") return null;
  return window.marked.parse(text, { gfm: true, breaks: true });
}

// Markdown rendering for agent bubbles. Uses marked.js loaded from CDN in
// index.html (a 30KB lib gives correct GFM with tables / nested lists /
// code blocks — handwritten regex would lose those).

export function renderMarkdown(text) {
  if (typeof window.marked === "undefined") return null;
  return window.marked.parse(text, { gfm: true, breaks: true });
}

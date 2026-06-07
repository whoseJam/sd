// Session picker — dropdown lets the user list / switch / create Claude
// sessions (each session = one JSONL file). The picker button shows the
// active session's AI title; clicking opens a menu of recent sessions.
//
// Server-side, switching just rewrites the watcher pin + resets the cache;
// creating a new session restarts Claude in tmux. The client refetches
// /api/sessions and clears messages when the SSE 'session-changed' event
// fires.

import { el, escapeHtml } from "./dom.js";
import { fetchSessions, newSession, switchSession } from "./api.js";

let refs = null;
let sessions = [];
let pinned = "";

export function initSessions(r) {
  refs = r;
  refs.picker.addEventListener("click", toggleMenu);
  refs.new.addEventListener("click", onNew);
  document.addEventListener("click", (e) => {
    if (
      refs.menu.hidden ||
      refs.picker.contains(e.target) ||
      refs.menu.contains(e.target)
    ) {
      return;
    }
    closeMenu();
  });
  refresh();
}

export async function refresh() {
  const j = await fetchSessions();
  pinned = j.pinned ?? "";
  sessions = j.sessions ?? [];
  renderPicker();
  renderMenu();
}

function renderPicker() {
  const active = sessions.find((s) => s.isActive);
  refs.title.textContent = active ? active.title : "no session";
}

function renderMenu() {
  refs.list.innerHTML = "";
  for (const s of sessions.slice(0, 30)) {
    const item = el("button", {
      class: "session-item" + (s.isActive ? " active" : ""),
      attrs: { type: "button" },
    });
    item.innerHTML =
      '<span class="session-title">' +
      escapeHtml(s.title) +
      '</span><span class="session-meta">' +
      humanTime(s.mtime) +
      " · " +
      s.entryCount +
      "</span>";
    item.addEventListener("click", () => onSwitch(s.path));
    refs.list.appendChild(item);
  }
}

function humanTime(ms) {
  const dt = Date.now() - ms;
  if (dt < 60_000) return "now";
  if (dt < 3600_000) return Math.floor(dt / 60_000) + "m";
  if (dt < 86_400_000) return Math.floor(dt / 3600_000) + "h";
  return Math.floor(dt / 86_400_000) + "d";
}

function toggleMenu() {
  if (refs.menu.hidden) openMenu();
  else closeMenu();
}

function openMenu() {
  refresh();
  refs.menu.hidden = false;
  refs.picker.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  refs.menu.hidden = true;
  refs.picker.setAttribute("aria-expanded", "false");
}

async function onSwitch(path) {
  if (path === pinned) {
    closeMenu();
    return;
  }
  closeMenu();
  await switchSession(path);
  // The SSE 'session-changed' event triggers chat clear + refetch in app.js.
}

async function onNew() {
  closeMenu();
  refs.title.textContent = "starting new session…";
  const r = await newSession();
  if (!r.ok) {
    refs.title.textContent = "failed: " + (r.error ?? "unknown");
    setTimeout(refresh, 2000);
  }
}

import { fetchSessions, newSession, switchSession } from "./api.js";
import { el, escapeHtml } from "./dom.js";

let refs = null;
let sessions = [];
let pinned = "";

export function initSessions(options) {
  refs = options;
  refs.picker.addEventListener("click", toggleMenu);
  refs.new.addEventListener("click", onNew);
  document.addEventListener("click", (event) => {
    if (
      refs.menu.hidden ||
      refs.picker.contains(event.target) ||
      refs.menu.contains(event.target)
    ) {
      return;
    }
    closeMenu();
  });
  refresh();
}

export async function refresh() {
  const response = await fetchSessions();
  pinned = response.pinned ?? "";
  sessions = response.sessions ?? [];
  renderPicker();
  renderMenu();
}

function renderPicker() {
  const active = sessions.find((session) => session.isActive);
  refs.title.textContent = active ? active.title : "no session";
}

function renderMenu() {
  refs.list.innerHTML = "";
  for (const session of sessions.slice(0, 30)) {
    const item = el("button", {
      class: "session-item" + (session.isActive ? " active" : ""),
      attrs: { type: "button" },
    });
    item.innerHTML =
      '<span class="session-title">' +
      escapeHtml(session.title) +
      '</span><span class="session-meta">' +
      humanTime(session.mtime) +
      " · " +
      session.entryCount +
      "</span>";
    item.addEventListener("click", () => onSwitch(session.path));
    refs.list.appendChild(item);
  }
}

function humanTime(ms) {
  const delta = Date.now() - ms;
  if (delta < 60_000) return "now";
  if (delta < 3600_000) return Math.floor(delta / 60_000) + "m";
  if (delta < 86_400_000) return Math.floor(delta / 3600_000) + "h";
  return Math.floor(delta / 86_400_000) + "d";
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
  const target = sessions.find((session) => session.path === path);
  const title = target?.title || "session";
  refs.onSwitching?.(title);
  const ok = await switchSession(path);
  if (ok) refs.onSwitched?.(title);
}

async function onNew() {
  closeMenu();
  refs.title.textContent = "starting new session…";
  refs.onSwitching?.("new session");
  const result = await newSession();
  if (result.ok) {
    refs.onSwitched?.("new session");
  } else {
    refs.title.textContent = "failed: " + (result.error ?? "unknown");
    setTimeout(refresh, 2000);
  }
}

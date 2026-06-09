import { createSignal } from "solid-js";

import type { Session } from "../types";

import { fetchSessions } from "../services/api";

const [sessions, setSessions] = createSignal<Session[]>([]);
const [pinned, setPinned] = createSignal("");
const [menuOpen, setMenuOpen] = createSignal(false);

export { sessions, pinned, menuOpen };

export function openMenu(): void {
  void refresh();
  setMenuOpen(true);
}

export function closeMenu(): void {
  setMenuOpen(false);
}

export function toggleMenu(): void {
  if (menuOpen()) closeMenu();
  else openMenu();
}

export async function refresh(): Promise<void> {
  const response = await fetchSessions();
  setPinned(response.pinned ?? "");
  setSessions(response.sessions ?? []);
}

export function activeTitle(): string {
  const active = sessions().find((s) => s.isActive);
  return active ? active.title : "no session";
}

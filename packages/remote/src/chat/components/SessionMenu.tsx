import { For, Show } from "solid-js";

import type { Session } from "../types";

import { newSession, switchSession } from "../services/api";
import { clearMessages, showLoading } from "../stores/messages";
import {
  closeMenu,
  menuOpen,
  pinned,
  refresh,
  sessions,
} from "../stores/sessions";

interface Props {
  onSwitching: (title: string) => void;
  onSwitched: (title: string) => void;
}

function humanTime(ms: number): string {
  const delta = Date.now() - ms;
  if (delta < 60_000) return "now";
  if (delta < 3600_000) return Math.floor(delta / 60_000) + "m";
  if (delta < 86_400_000) return Math.floor(delta / 3600_000) + "h";
  return Math.floor(delta / 86_400_000) + "d";
}

export function SessionMenu(props: Props) {
  async function onSwitch(session: Session) {
    if (session.path === pinned()) {
      closeMenu();
      return;
    }
    closeMenu();
    const title = session.title || "session";
    props.onSwitching(title);
    const ok = await switchSession(session.path);
    if (ok) props.onSwitched(title);
  }

  async function onNew() {
    closeMenu();
    clearMessages();
    showLoading("starting new session…");
    props.onSwitching("new session");
    const result = await newSession();
    if (result.ok) props.onSwitched("new session");
    else {
      showLoading("failed: " + (result.error ?? "unknown"));
      setTimeout(() => void refresh(), 2000);
    }
  }

  return (
    <Show when={menuOpen()}>
      <div class="session-menu" role="menu">
        <button
          class="session-item new"
          type="button"
          onClick={() => void onNew()}
        >
          <span class="session-title">＋ Start new session</span>
          <span class="session-meta">tmux restart Claude</span>
        </button>
        <div class="session-divider" />
        <div class="session-list">
          <For each={sessions().slice(0, 30)}>
            {(session) => (
              <button
                class="session-item"
                classList={{ active: session.isActive }}
                type="button"
                onClick={() => void onSwitch(session)}
              >
                <span class="session-title">{session.title}</span>
                <span class="session-meta">
                  {humanTime(session.mtime)} · {session.entryCount}
                </span>
              </button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}

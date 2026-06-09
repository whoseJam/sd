import { onMount } from "solid-js";

import {
  activeTitle,
  closeMenu,
  menuOpen,
  toggleMenu,
} from "../stores/sessions";
import { SessionMenu } from "./SessionMenu";
import { StatusPill } from "./StatusPill";

interface Props {
  onSwitching: (title: string) => void;
  onSwitched: (title: string) => void;
}

export function Header(props: Props) {
  let header!: HTMLElement;

  onMount(() => {
    document.addEventListener("click", (event) => {
      if (!menuOpen()) return;
      const target = event.target as Node | null;
      if (target && header.contains(target)) return;
      closeMenu();
    });
  });

  return (
    <header ref={header}>
      <button
        class="session-picker"
        type="button"
        aria-expanded={menuOpen() ? "true" : "false"}
        aria-haspopup="menu"
        onClick={toggleMenu}
      >
        <span class="brand">sd</span>
        <span class="sep">/</span>
        <span class="session-title">{activeTitle()}</span>
        <span class="caret">▾</span>
      </button>
      <StatusPill />
      <SessionMenu
        onSwitching={props.onSwitching}
        onSwitched={props.onSwitched}
      />
    </header>
  );
}

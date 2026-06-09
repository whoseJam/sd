import { For, Show } from "solid-js";

import { loading, messages } from "../stores/messages";
import { MessageRow } from "./MessageRow";

export function Messages() {
  return (
    <main id="messages">
      <For each={messages}>{(m) => <MessageRow message={m} />}</For>
      <Show when={loading()}>
        <div class="msg-loading">
          <span class="dot" />
          <span class="dot" />
          <span class="dot" />
          <span class="text">{loading()}</span>
        </div>
      </Show>
    </main>
  );
}

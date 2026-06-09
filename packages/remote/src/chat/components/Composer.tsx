import { createSignal } from "solid-js";

import { sendUserMessage } from "../services/api";
import {
  adoptServerId,
  appendOptimistic,
  clearOptimistic,
  markFailed,
  registerOptimistic,
} from "../stores/messages";
import { setClientThinkingNow } from "../stores/status";

export function Composer() {
  const [value, setValue] = createSignal("");
  const [sending, setSending] = createSignal(false);
  let textarea!: HTMLTextAreaElement;

  async function submit() {
    const text = value().trim();
    if (!text) return;
    setValue("");
    textarea.style.height = "36px";

    const optimisticId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    appendOptimistic({
      id: optimisticId,
      ts: Date.now(),
      from: "user",
      text,
    });
    registerOptimistic(optimisticId, text);
    setClientThinkingNow(true);

    setSending(true);
    try {
      const reply = await sendUserMessage(text);
      if (reply?.id) {
        clearOptimistic(text);
        adoptServerId(optimisticId, reply.id);
      }
    } catch {
      clearOptimistic(text);
      markFailed(optimisticId);
      setClientThinkingNow(false);
    } finally {
      setSending(false);
      textarea.focus();
    }
  }

  function autosize() {
    textarea.style.height = "36px";
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + "px";
  }

  return (
    <footer>
      <textarea
        id="input"
        ref={textarea}
        placeholder="Message"
        rows={1}
        value={value()}
        onInput={(e) => {
          setValue(e.currentTarget.value);
          autosize();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
      />
      <button
        id="send"
        type="button"
        disabled={sending()}
        onClick={() => void submit()}
      >
        Send
      </button>
    </footer>
  );
}

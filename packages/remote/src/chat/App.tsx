import { onMount } from "solid-js";

import { Composer } from "./components/Composer";
import { Header } from "./components/Header";
import { Messages } from "./components/Messages";
import { Preview, PreviewPill } from "./components/Preview";
import { Typing } from "./components/Typing";
import { fetchMessages, fetchPreview } from "./services/api";
import { connectSSE } from "./services/sse";
import {
  clearLoading,
  clearMessages,
  latestTs,
  renderMsg,
  showLoading,
} from "./stores/messages";
import { applyPreview } from "./stores/preview";
import { refresh as refreshSessions } from "./stores/sessions";
import {
  noteNetFailure,
  noteNetSuccess,
  poll as pollStatus,
  setClientThinkingNow,
} from "./stores/status";

async function catchUpMessages(): Promise<void> {
  let incoming;
  try {
    incoming = await fetchMessages(latestTs());
    noteNetSuccess();
  } catch {
    noteNetFailure();
    return;
  }
  let sawAgentContent = false;
  for (const message of incoming) {
    renderMsg(message);
    if (message.from === "agent" && (message.text || message.images?.length)) {
      sawAgentContent = true;
    }
  }
  if (sawAgentContent) setClientThinkingNow(false);
}

async function loadInitialPreview(): Promise<void> {
  const next = await fetchPreview();
  applyPreview(next);
}

function handleSessionSwitching(title: string): void {
  clearMessages();
  showLoading(`loading ${title}`);
}

function handleSessionSwitched(_title: string): void {
  // Server has accepted the switch; watcher is replaying the new JSONL.
  // Loading row stays until the first real message renders.
  let attempt = 0;
  const tick = async () => {
    await catchUpMessages();
    void refreshSessions();
    if (++attempt < 20) setTimeout(tick, 500);
    else clearLoading();
  };
  void tick();
}

export function App() {
  onMount(() => {
    connectSSE({
      onMessage(message) {
        renderMsg(message);
        if (
          message.from === "agent" &&
          (message.text || message.images?.length)
        ) {
          setClientThinkingNow(false);
        }
      },
      onReconnect() {
        void catchUpMessages();
        void loadInitialPreview();
        void pollStatus();
      },
    });

    void catchUpMessages();
    void loadInitialPreview();
    void pollStatus();
    void refreshSessions();

    setInterval(() => void pollStatus(), 5000);
    // SSE is swallowed by some tunnels — poll regardless.
    setInterval(() => void catchUpMessages(), 2000);
    setInterval(() => void refreshSessions(), 5000);
    setInterval(() => void loadInitialPreview(), 2000);
  });

  return (
    <>
      <Preview />
      <div id="app">
        <PreviewPill />
        <Header
          onSwitching={handleSessionSwitching}
          onSwitched={handleSessionSwitched}
        />
        <Messages />
        <Typing />
        <Composer />
      </div>
    </>
  );
}

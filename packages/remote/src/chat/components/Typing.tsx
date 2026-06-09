import { thinking } from "../stores/status";

export function Typing() {
  return (
    <div class="typing" classList={{ show: thinking() }}>
      Claude is typing
      <span class="dot" />
      <span class="dot" />
      <span class="dot" />
    </div>
  );
}

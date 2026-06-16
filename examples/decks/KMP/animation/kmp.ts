// Pure KMP state-machine. The deck animations subscribe via callbacks so the
// algorithm stays in one place and each script focuses on visuals.
//
// Convention: all indices are 1-based; len[1] = 0; t and s are zero-padded
// strings so t[1] is the first real char.

export function buildLen(t: string): number[] {
  // t is the 1-padded pattern: t[0] is sentinel, t[1..n] are real chars.
  const n = t.length - 1;
  const len = new Array(n + 1).fill(0);
  let j = 0;
  for (let i = 2; i <= n; i++) {
    while (j > 0 && t[j + 1] !== t[i]) j = len[j];
    if (t[j + 1] === t[i]) j++;
    len[i] = j;
  }
  return len;
}

export type Step =
  | { kind: "advance-i"; i: number }
  | { kind: "match"; i: number; j: number }
  | { kind: "fail"; i: number; j: number } // j here = the position in t that failed (= j_old+1)
  | {
      kind: "jump";
      i: number;
      jFrom: number;
      jTo: number;
      jumpStep: number;
      lastJump: boolean;
    };

// Trace KMP and emit a sequence of steps. The visual layer interprets them.
export function traceKMP(s: string, t: string, startI = 1): Step[] {
  // Both s and t are 1-padded.
  const len = buildLen(t);
  const ns = s.length - 1;
  const steps: Step[] = [];

  let j = 0;
  for (let i = startI; i <= ns; i++) {
    steps.push({ kind: "advance-i", i });

    if (t[j + 1] === s[i]) {
      j++;
      steps.push({ kind: "match", i, j });
      continue;
    }

    // First mismatch at this i: position (j+1) in t differed from s[i].
    steps.push({ kind: "fail", i, j: j + 1 });

    // Successive jumps via len[].
    let step = 0;
    while (j > 0 && t[j + 1] !== s[i]) {
      step++;
      const jNext = len[j];
      // lastJump set later — we don't yet know if this is the last.
      steps.push({
        kind: "jump",
        i,
        jFrom: j,
        jTo: jNext,
        jumpStep: step,
        lastJump: false,
      });
      j = jNext;
    }

    if (t[j + 1] === s[i]) {
      j++;
      steps.push({ kind: "match", i, j });
    } else {
      // Failed entirely; j stayed 0, the j+1 cell is still wrong.
      steps.push({ kind: "fail", i, j });
    }
  }

  // Mark the final jump in each i-block as lastJump (the visual layer uses
  // this to clear scaffolding only once per i).
  for (let k = steps.length - 1; k >= 0; k--) {
    const cur = steps[k];
    if (cur.kind !== "jump") continue;
    let isLast = true;
    for (let m = k + 1; m < steps.length; m++) {
      if (steps[m].kind === "advance-i") break;
      if (steps[m].kind === "jump") {
        isLast = false;
        break;
      }
    }
    if (isLast) (cur as { lastJump: boolean }).lastJump = true;
  }

  return steps;
}

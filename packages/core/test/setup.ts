// Animate.ts boots a requestAnimationFrame loop at module load. happy-dom
// provides RAF, but vitest tears down the worker before the loop notices,
// leaving Animate.tick reading from an unloaded Window module. Tier 1 tests
// don't drive the timeline — stub RAF to a noop so the loop never starts.
globalThis.requestAnimationFrame = (() => 0) as typeof requestAnimationFrame;

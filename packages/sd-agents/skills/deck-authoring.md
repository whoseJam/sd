---
title: Writing sd deck animations
trigger: Use when writing or modifying an animation .ts file under examples/decks/<deck>/animation/, or a standalone file under examples/animations/. Covers staggered fade-in entrance, palette/easing factories, await sd.pause() semantics, size-before-center, and narrative-text avoidance.
priority: high
---

# Writing sd deck animations

(Placeholder: SD-PPT Animation Style content gets migrated here in the next pass.)

## Slide layout

`<sd-animation>` is a custom element with `:host { display: block }`. Reveal centers text but not block children, so each tag must carry `style="margin: 0 auto; width: ...; height: ...;"` to center. Write `margin: 0 auto` first, then the size.

## Animation script defaults

- Get the palette + easings from factories at the top of every file:
  ```ts
  const palette = sd.color();
  const easings = sd.easing();
  ```
  Use `palette.steelBlue` / `easings.easeOut`, not `"#4682b4"` / `"easeOut"`. Hex only when the palette has no match.
- **Staggered fade-in entrance.** Layer by visual depth: grid/background → frame → input data → measurement scaffolding → numeric labels. 80–200ms delay per element within a layer, ≥200ms gap between layers. All entrance animations fire concurrently before the first `await sd.pause()`.
- **`await sd.pause()` is a semantic beat, not a timer.** Each pause corresponds to one algorithmic step.
- **Size before center.** `setText` / `setFontSize` / `setWidth` commit the new size synchronously, and `setCx` reads that size. Always size first, then center.

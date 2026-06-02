interface RevealHighlightPlugin {
  id: string;
  init: (reveal: unknown) => void | Promise<unknown>;
}

declare const factory: () => RevealHighlightPlugin;
export default factory;

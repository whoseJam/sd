// CLI flags and shared state are propagated via the `global` object. They are
// populated by parser.parseInput() from `-x` / `--x` argv flags.

export {};

declare global {
  var projectRoot: string;
  var source: string;
  var targetFolder: string;

  // -i <path>
  var i: string | undefined;
  // -o <path>
  var o: string | undefined;
  // -d <domain> | -d (development mode toggle)
  var d: string | boolean | undefined;
  // -w (watch)
  var w: boolean | undefined;
  // -s (silent / exit on first error)
  var s: boolean | undefined;
  // -p <port>
  var p: string | undefined;
  // -l (use local sd.js / myreveal.js)
  var l: boolean | undefined;
  // -domain <value>
  var domain: string | undefined;
  // -framework <name> (ppt host framework: reveal | plain | ...)
  var framework: string | undefined;

  // task self-flags
  var sd: boolean | undefined;
  var reveal: boolean | undefined;
  var theme: boolean | undefined;
}

// CLI flags and shared state are propagated via the `global` object. They are
// populated by parser.parseInput() from `-x` / `--x` argv flags.

export {};

declare global {
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
  // -domain <value>
  var domain: string | undefined;
  // -framework <name> (ppt host framework: reveal | impress | webslides)
  var framework: string | undefined;
  // -entry <relpath> (project-rooted ppt: which subdir is the deck entry)
  var entry: string | undefined;

  // set by `gulp sd` so ppt/animation/animation-group skip re-copying dist/sd.js
  var sd: boolean | undefined;
  // set by `gulp <framework>` so ppt skips re-copying the framework bundle
  var reveal: boolean | undefined;
  var webslides: boolean | undefined;
  var impress: boolean | undefined;
}

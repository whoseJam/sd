const DEFAULT_FONTS = ["Times New Roman", "Arial", "Consolas"];

let parsed = false;

export function parseInput(): void {
  if (parsed) return;
  parsed = true;
  const args = process.argv.slice(2);
  const g = globalThis as Record<string, unknown>;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const key = arg.replace(/^-+/, "");
    const value = args[i + 1];
    if (arg.startsWith("-")) {
      if (!value || value.startsWith("-")) {
        g[key] = true;
      } else {
        g[key] = value;
        i++;
      }
    } else {
      g[key] = true;
    }
  }
  if (global.domain) {
    if (global.domain === (true as unknown as string)) global.domain = "/";
    if (global.domain.endsWith("/") || global.domain.endsWith("\\"))
      global.domain = global.domain.slice(0, -1);
  }
}

export function requireOutputPath(command: string): string {
  if (global.o) return global.o;
  console.error(`[Error] -o <output-dir> required for ${command}.`);
  process.exit(1);
}

export function getFonts(): string[] {
  return DEFAULT_FONTS;
}

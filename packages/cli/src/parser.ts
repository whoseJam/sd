import colors from "colors-console";
import fs from "node:fs";
import path from "node:path";

let parsed = false;
let config: Record<string, string> | undefined;

const configHints: Record<string, string> = {
  animationOutputPath:
    "Default output path for animation (For example: C:/Users/xxx/Desktop/output)",
  pptOutputPath:
    "Default output path for PPT (For example: C:/Users/xxx/Desktop/output)",
  releaseOutputPath:
    "Default output path for release package (For example: C:/Users/xxx/Desktop/release)",
  ragOutputPath:
    "Default output path for RAG text files (For example: C:/Users/xxx/Desktop/rag)",
};

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

export function parseConfig(key: string): string {
  if (config === undefined) {
    const configPath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "..",
      "myconfig.json",
    );
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch {
      fs.writeFileSync(configPath, JSON.stringify({}, null, 4));
      config = {};
    }
  }
  if (!config || !config[key]) {
    console.log(
      colors(
        "red",
        `[Error] Configuration key '${key}' not found. Please check the configuration.`,
      ),
    );
    console.log(colors("cyan", configHints[key]));
    process.exit();
  }
  return config[key];
}

#!/usr/bin/env bun

import colors from "colors-console";
import fs from "node:fs";
import path from "node:path";

const configKeys = [
  "animationOutputPath",
  "pptOutputPath",
  "tunnelName",
  "tunnelHostname",
];

const configHints: Record<string, string> = {
  animationOutputPath:
    "Default output path for animation (For example: C:/Users/xxx/Desktop/output)",
  pptOutputPath:
    "Default output path for PPT (For example: C:/Users/xxx/Desktop/output)",
  tunnelName:
    "Cloudflare named tunnel name (optional; see docs/named-tunnel-setup.md)",
  tunnelHostname:
    "Cloudflare named tunnel hostname, e.g. chat.example.xyz (optional; pairs with tunnelName)",
};

function printSupportedKeys(): void {
  console.log(colors("cyan", "Supported configuration keys:"));
  for (const key of configKeys) {
    console.log(
      colors("green", `- ${key}: `) + colors("yellow", configHints[key]),
    );
  }
}

function validateConfigKey(key: string): void {
  if (!configKeys.includes(key)) {
    console.log(colors("red", `[Error] Unsupported configuration key: ${key}`));
    printSupportedKeys();
    process.exit(1);
  }
}

function updateConfig(configPath: string, key: string, value: string): void {
  validateConfigKey(key);
  let config: Record<string, string> = {};
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (readError) {
    const err = readError as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      console.error(colors("red", `Error reading config file: ${err.message}`));
      process.exit(1);
    }
  }
  config[key] = value;
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
    console.log(
      colors("green", `Successfully updated `) +
        colors("cyan", key) +
        colors("green", ` to `) +
        colors("cyan", value) +
        colors("green", ` in ${configPath}`),
    );
  } catch (writeError) {
    const err = writeError as NodeJS.ErrnoException;
    console.error(
      colors("red", `Error writing to config file: ${err.message}`),
    );
    process.exit(1);
  }
}

function main(): void {
  const configPath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "..",
    "myconfig.json",
  );
  if (process.argv.length !== 4) {
    console.log(
      colors("cyan", "Usage: ") + colors("green", "sd-config <key> <value>"),
    );
    printSupportedKeys();
    process.exit(1);
  }
  const key = process.argv[2];
  const value = process.argv[3];
  updateConfig(configPath, key, value);
}

main();

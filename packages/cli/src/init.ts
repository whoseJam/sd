#!/usr/bin/env node
// `sd-init [dir]` scaffolds a fresh sd project at <dir>; defaults to cwd.
// Plain Node so it runs via npx before the user installs Bun.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const templateDir = resolve(here, "..", "templates", "starter");

function main(): void {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");
  const skipInstall = args.includes("--no-install");
  const positional = args.filter((a) => !a.startsWith("-"));
  const target = resolve(positional[0] ?? ".");

  if (!existsSync(templateDir)) {
    die(`template missing at ${templateDir} — reinstall @whosejam/sd-cli`);
  }

  ensureTargetEmpty(target, force);
  mkdirSync(target, { recursive: true });
  cpSync(templateDir, target, { recursive: true });
  patchPackageJson(target);

  console.log(`✓ scaffolded sd project at ${target}`);
  console.log();
  console.log("Next steps:");
  console.log(`  cd ${process.argv[1] ? relativeTo(process.cwd(), target) : target}`);
  if (skipInstall) console.log("  pnpm install");
  else runInstall(target);
  console.log("  pnpm open hello       # requires Bun: https://bun.sh");
}

function ensureTargetEmpty(target: string, force: boolean): void {
  if (!existsSync(target)) return;
  const entries = readdirSync(target).filter((n) => n !== ".git");
  if (entries.length === 0) return;
  if (force) return;
  die(
    `target ${target} is not empty (${entries.length} entries). Use --force to scaffold into it anyway.`,
  );
}

function patchPackageJson(target: string): void {
  const pkgPath = join(target, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  // Use the installed @whosejam/sd-cli version so the scaffold tracks the
  // exact release the user ran `npx` against, instead of a hardcoded "*"
  // baseline.
  const cliVersion = readCliVersion();
  if (cliVersion) {
    if (pkg.dependencies?.["@whosejam/sd-cli"])
      pkg.dependencies["@whosejam/sd-cli"] = `^${cliVersion}`;
    if (pkg.devDependencies?.["@whosejam/sd-cli"])
      pkg.devDependencies["@whosejam/sd-cli"] = `^${cliVersion}`;
    if (pkg.dependencies?.["@whosejam/sd"])
      pkg.dependencies["@whosejam/sd"] = `^${cliVersion}`;
  }
  pkg.name = nameFromDir(target);
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

function readCliVersion(): string | null {
  try {
    const pkgPath = require.resolve("@whosejam/sd-cli/package.json");
    return JSON.parse(readFileSync(pkgPath, "utf-8")).version;
  } catch {
    return null;
  }
}

function nameFromDir(target: string): string {
  return target
    .split(/[/\\]/)
    .filter(Boolean)
    .slice(-1)[0]
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase();
}

function runInstall(target: string): void {
  console.log();
  console.log("Running pnpm install...");
  const { spawnSync } = require("node:child_process") as typeof import("node:child_process");
  const result = spawnSync("pnpm", ["install"], {
    cwd: target,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.log("⚠ pnpm install failed — run it manually.");
  }
}

function relativeTo(from: string, to: string): string {
  const r = require("node:path").relative(from, to);
  return r || to;
}

function die(message: string): never {
  console.error(`sd-init: ${message}`);
  process.exit(1);
}

main();

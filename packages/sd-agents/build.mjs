#!/usr/bin/env node
// Renders skills/ + agents/ into per-harness plugin layouts under dist/.
// MCP tools are not rendered per harness: each plugin layout simply
// registers the same mcp-server.ts.

import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const here = dirname(fileURLToPath(import.meta.url));
const skills = loadDir(join(here, "skills"));
const agents = loadDir(join(here, "agents"));

writeClaudePlugin(join(here, "dist", "claude"), { skills, agents });
writeCodexPlugin(join(here, "dist", "codex"), { skills, agents });

function loadDir(dir) {
  let entries;
  try {
    entries = readdirSync(dir).filter((name) => name.endsWith(".md"));
  } catch {
    return [];
  }
  return entries.map((name) => {
    const slug = name.replace(/\.md$/, "");
    const raw = readFileSync(join(dir, name), "utf-8");
    const parsed = matter(raw);
    return { slug, frontmatter: parsed.data, body: parsed.content.trimStart() };
  });
}

function writeClaudePlugin(outDir, { skills, agents }) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  for (const skill of skills) {
    const skillDir = join(outDir, "skills", `sd-${skill.slug}`);
    mkdirSync(skillDir, { recursive: true });
    const frontmatter = formatYaml({
      name: `sd-${skill.slug}`,
      description: skill.frontmatter.trigger,
    });
    writeFileSync(join(skillDir, "SKILL.md"), frontmatter + skill.body);
  }

  for (const agent of agents) {
    const agentsDir = join(outDir, "agents");
    mkdirSync(agentsDir, { recursive: true });
    const frontmatter = formatYaml({
      name: `sd-${agent.slug}`,
      description: agent.frontmatter.trigger,
    });
    writeFileSync(join(agentsDir, `sd-${agent.slug}.md`), frontmatter + agent.body);
  }

  const pluginDir = join(outDir, ".claude-plugin");
  mkdirSync(pluginDir, { recursive: true });
  writeFileSync(
    join(pluginDir, "plugin.json"),
    JSON.stringify(
      {
        name: "sd-agents",
        version: "0.0.1",
        description: "sd deck authoring conventions, runtime API, and MCP tools.",
        mcpServers: {
          sd: {
            command: "bun",
            args: ["${CLAUDE_PLUGIN_ROOT}/mcp-server.ts"],
          },
        },
      },
      null,
      2,
    ) + "\n",
  );

  cpSync(join(here, "mcp-server.ts"), join(outDir, "mcp-server.ts"));
  writeFileSync(
    join(outDir, "README.md"),
    "# sd-agents (Claude Code plugin)\n\n" +
      "Generated from `packages/sd-agents/skills/` and `packages/sd-agents/agents/`. " +
      "Edit those sources, not this directory.\n\n" +
      "Install:\n\n```\n/plugin add <path>/packages/sd-agents/dist/claude\n```\n",
  );
}

function writeCodexPlugin(outDir, { skills: _skills, agents: _agents }) {
  // Stub: Codex adapter lives here when we actually need it. The point of
  // calling it out now is so the build.mjs shape stays multi-harness.
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "README.md"),
    "# sd-agents (Codex)\n\nNot yet generated. See packages/sd-agents/build.mjs writeCodexPlugin.\n",
  );
}

function formatYaml(data) {
  let result = "---\n";
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (typeof value === "string" && (value.includes("\n") || value.length > 80)) {
      result += `${key}: |\n${value.split("\n").map((line) => "  " + line).join("\n")}\n`;
    } else {
      result += `${key}: ${JSON.stringify(value)}\n`;
    }
  }
  result += "---\n\n";
  return result;
}

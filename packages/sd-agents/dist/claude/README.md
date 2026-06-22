# sd-agents (Claude Code plugin)

Generated from `packages/sd-agents/skills/` and `packages/sd-agents/agents/`. Edit those sources, not this directory.

## Install

From GitHub (recommended):

```
claude plugin marketplace add whoseJam/sd
claude plugin install sd-agents@sd
```

From a local clone (for development on the plugin itself):

```
claude plugin marketplace add /path/to/sd
claude plugin install sd-agents@sd
```

Both paths use the `sd` marketplace declared in `.claude-plugin/marketplace.json` at the repo root. Restart Claude Code (or `/reload-plugins`) after install to activate the skills and MCP server.

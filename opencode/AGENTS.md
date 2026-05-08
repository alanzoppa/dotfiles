# AI Assistant Instructions

## Workflow

- **Always maintain a todo list** for complex multi-step tasks. Update progress as you work, in both Plan and Build mode.
- **MUST parallelize with subagents** — Default to dispatching subagents. Doing everything yourself is the exception, not the rule. This applies in ALL modes (Plan and Build).
- **Push after successful complex changes** - When completing a series of related changes (model + migration + command updates + tests passing), commit AND push immediately. Unless told otherwise, ensure that ALL tests are green before pushing.
- **Test new functionality** plan and write automated tests as you go. Write regression tests where appropriate.
- **Watch for AGENTS.md files** - Check for AGENTS.md files in the project root and subdirectories. Create new ones to share context with other agents. Keep them up to date when making changes to documented features, then commit and push.
- **This file is tracked in a git repo** — if you modify it, commit and push the repo it lives in (resolve the symlink to find the repo root).
- **Skills and agent files are also in git repos** — the same rule applies: if you modify skill or agent files, resolve symlinks to find the containing repo root, then commit and push.

## Subagent Dispatch

You are the only agent that dispatches subagents. Subagents never dispatch others. Use the Task tool with the appropriate subagent type.

### Applies in ALL modes (Plan and Build)

- **Plan mode**: Dispatch `@flash`/`@hurry` for exploration, codebase searches, and info-gathering in parallel. Never read files sequentially when 2+ subagents could gather the same info faster.
- **Build mode**: Dispatch `@kimi`/`@hurry`/`@flash` for independent implementation tasks in parallel. The primary model orchestrates and handles only cross-cutting work.

### Decision Matrix

| Task Type | Subagent | Model | Why |
|---|---|---|---|
| Exploring many files, batch metadata edits, pattern-based find-and-replace | `@flash` | `ollama-cloud/deepseek-v4-flash` | Token-efficient, fast on large sets |
| Writing standalone files, tests, configs, migrations, data transforms | `@hurry` | `ollama-cloud/minimax-m2.7` | Fast for well-defined, self-contained work |
| Architectural changes, refactoring, complex feature implementation | `@kimi` | `ollama-cloud/kimi-k2.6` | Smarter model for tasks requiring judgment |
| Open-ended codebase searches, grepping many patterns across many files | `@hurry` | `ollama-cloud/minimax-m2.7` | Avoids wasting primary context |
| Multi-step orchestration, planning, tasks requiring deep conversation context | Primary model | Your model | Only the primary model has full context |

## Subagent MCP limitation

MCP servers (notes-browser, Linear, Notion, GitHub) are enabled in `opencode.json` but **subagents dispatched via the Task tool cannot access them**. Only the primary model and subagents that use tool calls directly (i.e. not Task tool dispatch) inherit MCP tools. When dispatching subagents to investigate across MCP-backed systems, the primary model must do the MCP calls itself or the subagent prompt must account for the limitation.

### Capability Matrix

| Subagent | Model | Temp | read | glob | grep | edit | bash | webfetch | task |
|---|---|---|---|---|---|---|---|---|---|
| `@kimi` | `ollama-cloud/kimi-k2.6` | 0.3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `@hurry` | `ollama-cloud/minimax-m2.7` | 0.2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `@flash` | `ollama-cloud/deepseek-v4-flash` | 0.1 | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |

### Rules for Dispatching

- **Parallelize aggressively** — If a task has 2+ independent steps, you MUST dispatch them to subagents in parallel. Only skip dispatch if steps are truly sequential or require full conversation context. Doing everything yourself is the exception, not the default.
- **Match complexity to model** — don't send trivial tasks to `@kimi` or demanding tasks to `@hurry`.
- **Flash tasks must be well-defined** — pattern-based edits, metadata changes, or exploration only. No architectural decisions.
- **Always specify the subagent type** when presenting a plan. Say "I'll dispatch X to `@kimi`, Y to `@hurry`".
- **Present subagent choice in plan** — before entering Build mode, explain which subagents will handle which parts.
- **Self-check before acting** — Before executing multi-step work, explicitly ask: "Can any of these steps be dispatched to a subagent?" If yes, dispatch them. When your todo list has 3+ items, at least half should be dispatched to subagents where possible.
- **The primary model only does work that requires full conversation context** — orchestration, planning, cross-cutting changes. All other work goes to subagents.

## Code Style

- **Comments are terse** omit if code is self-explanatory, use sparingly, keep short.
- **Follow existing patterns** in the codebase.
- **Type safety is preferred** when supported by the language.
- **Keep responses concise** - max 4 lines unless user asks for detail.
- **Don't reinvent the wheel** - If a robust library is available, prefer this over implementing something from scratch. Use standard or existing package management solutions. Don't re-test library functionality.
- **Don't fight the framework/library** - Counter with framework-centric suggestions when the user's request is a poor fit. Look for a simpler solution that meets the users needs.

## Server Skills

Server-specific knowledge is often available via opencode skills. Use the `skill` tool to discover and load them on-demand.

- **impeccable**: Frontend design skill — craft, shape, audit, critique, polish, animate, colorize, typeset, layout, delight, and more. Covers UX review, anti-patterns, accessibility, typography, motion, live variant mode. Installed via `_submodules/impeccable` submodule. Use the `skill` tool with name `impeccable`.
- **agent-browser**: Browser automation via agent-browser CLI. Use the `skill` tool with name `agent-browser`.

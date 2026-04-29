# AI Assistant Instructions

## Workflow

- **Always maintain a todo list** for complex multi-step tasks. Update progress as you work, even in Build mode.
- **Push after successful complex changes** - When completing a series of related changes (model + migration + command updates + tests passing), commit AND push immediately. Unless told otherwise, ensure that ALL tests are green before pushing.
- **Test new functionality** plan and write automated tests as you go. Write regression tests where appropriate.
- **Watch for AGENTS.md files** - Check for AGENTS.md files in the project root and subdirectories. Create new ones to share context with other agents. Keep them up to date when making changes to documented features, then commit and push.
- **This file is tracked in a git repo** — if you modify it, commit and push the repo it lives in (resolve the symlink to find the repo root).
- **Skills and agent files are also in git repos** — the same rule applies: if you modify skill or agent files, resolve symlinks to find the containing repo root, then commit and push.
- **Prefer subagent parallelization** - When planning complex multi-step tasks, dispatch non-interdependent work to subagents in parallel. Use the dispatch guide below to pick the right subagent for each task.

## Code Style

- **Comments are terse** omit if code is self-explanatory, use sparingly, keep short.
- **Follow existing patterns** in the codebase.
- **Type safety is preferred** when supported by the language.
- **Keep responses concise** - max 4 lines unless user asks for detail.
- **Don't reinvent the wheel** - If a robust library is available, prefer this over implementing something from scratch. Use standard or existing package management solutions. Don't re-test library functionality.

## Server Skills

Server-specific knowledge is often available via opencode skills. Use the `skill` tool to discover and load them on-demand.

## Browser Automation: agent-browser

**Load the skill for full instructions:** Use the `skill` tool with name `agent-browser`.

## Subagent Dispatch

You are the only agent that dispatches subagents. Subagents never dispatch others. Use the Task tool with the appropriate subagent type.

### Decision Matrix

| Task Type | Subagent | Model | Why |
|---|---|---|---|
| Exploring many files, batch metadata edits, pattern-based find-and-replace | `@flash` | `ollama-cloud/deepseek-v4-flash` | Token-efficient, fast on large sets |
| Writing standalone files, tests, configs, migrations, data transforms | `@hurry` | `ollama-cloud/minimax-m2.7` | Fast for well-defined, self-contained work |
| Architectural changes, refactoring, complex feature implementation | `@kimi` | `ollama-cloud/kimi-k2.6` | Smarter model for tasks requiring judgment |
| Open-ended codebase searches, grepping many patterns across many files | `@hurry` | `ollama-cloud/minimax-m2.7` | Avoids wasting primary context |
| Multi-step orchestration, planning, tasks requiring deep conversation context | Primary model | Your model | Only the primary model has full context |

### Capability Matrix

| Subagent | Model | Temp | read | glob | grep | edit | bash | webfetch | task |
|---|---|---|---|---|---|---|---|---|---|
| `@kimi` | `ollama-cloud/kimi-k2.6` | 0.3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `@hurry` | `ollama-cloud/minimax-m2.7` | 0.2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `@flash` | `ollama-cloud/deepseek-v4-flash` | 0.1 | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |

### Rules for Dispatching

- **Parallelize aggressively** — when you have 2+ independent tasks, dispatch them in parallel to different subagents.
- **Match complexity to model** — don't send trivial tasks to `@kimi` or demanding tasks to `@hurry`.
- **Flash tasks must be well-defined** — pattern-based edits, metadata changes, or exploration only. No architectural decisions.
- **Always specify the subagent type** when presenting a plan. Say "I'll dispatch X to `@kimi`, Y to `@hurry`".
- **Present subagent choice in plan** — before entering Build mode, explain which subagents will handle which parts.

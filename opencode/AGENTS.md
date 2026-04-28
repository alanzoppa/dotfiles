# AI Assistant Instructions

## Workflow

- **Always maintain a todo list** for complex multi-step tasks. Update progress as you work, even in Build mode.
- **Push after successful complex changes** - When completing a series of related changes (model + migration + command updates + tests passing), commit AND push immediately. Unless told otherwise, ensure that ALL tests are green before pushing.
- **Test new functionality** plan and write automated tests as you go. Write regression tests where appropriate.
- **Watch for AGENTS.md files** - Check for AGENTS.md files in the project root and subdirectories. Create new ones to share context with other agents. Keep them up to date when making changes to documented features, then commit and push.
- **This file is tracked in a git repo** — if you modify it, commit and push the repo it lives in (resolve the symlink to find the repo root).
- **Skills and agent files are also in git repos** — the same rule applies: if you modify skill or agent files, resolve symlinks to find the containing repo root, then commit and push.
- **Prefer subagent parallelization** - When planning complex multi-step tasks, execute any non-interdependent tasks with subagents, in parallel where possible. Use the @hurry subagent for simple tasks and your own model for more complex tasks.

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

## Subagent: Hurry

Use the `@hurry` subagent (via the Task tool) for well-defined, self-contained or repetitive tasks where speed matters more than deep reasoning. Hurry runs on `ollama-cloud/minimax-m2.7` — fast but less capable than the primary model. It has `read`, `glob`, `grep`, `edit`, `bash`, and `webfetch` access.

**When to use Hurry:**
- Open-ended searches that would waste context
- Generating migration scripts or data transformations
- Tasks with clear specs that don't need architectural judgment

**When NOT to use Hurry:**
- Complex orchestration or multi-step planning
- Human-readable documentation
- Tasks requiring understanding of subtle interdependencies
- Anything requiring deep context from the conversation

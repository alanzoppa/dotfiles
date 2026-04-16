# AI Assistant Instructions

## Workflow

- **Always maintain a todo list** for complex multi-step tasks. Update progress as you work.
- **Push after successful complex changes** - When completing a series of related changes (model + migration + command updates + tests passing), commit AND push immediately.
- **Test migrations** before committing model changes.
- **Watch for AGENTS.md files** - Check for AGENTS.md files in the project root and subdirectories. Create new ones to share context with other agents. Keep them up to date when making changes to documented features, then commit and push.
- **This file is tracked in a git repo** — if you modify it, commit and push the repo it lives in (resolve the symlink to find the repo root).
- **Skills and agent files are also in git repos** — the same rule applies: if you modify skill or agent files, resolve symlinks to find the containing repo root, then commit and push.

## Code Style

- **No comments** unless explicitly requested.
- **Follow existing patterns** in the codebase.
- **Type safety is preferred** when supported by the language.
- **Keep responses concise** - max 4 lines unless user asks for detail.

## Server Skills

Server-specific knowledge is available via opencode skills. Use the `skill` tool to discover and load them on-demand.

## Subagent: Hurry

Use the `@hurry` subagent (via the Task tool) for well-defined, self-contained or repetitive tasks where speed matters more than deep reasoning. Hurry runs on `ollama-cloud/minimax-m2.7` — fast but less capable than the primary model. When in Plan mode, always highlight where in the plan @hurry will be used.

**When to use Hurry:**
- Open-ended searches that waste context
- Generating migration scripts or data transformations
- Tasks with clear specs that don't need architectural judgment

**When NOT to use Hurry:**
- Complex orchestration or multi-step planning
- Human or agent-readable documentation
- Tasks requiring understanding of subtle interdependencies
- Anything requiring deep context from the conversation

**Critical rules:**
- **Always include source code** (models, schemas, interfaces) in the prompt when output must match them. Hurry cannot read files — it hallucinates plausible but wrong field names, defaults, and behaviors when it lacks context.
- **Always review for hallucinated details** — especially field names, default values, and behavioral descriptions. It defaults to common patterns rather than matching reality.

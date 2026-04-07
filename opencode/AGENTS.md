# AI Assistant Instructions

## Workflow

- **Always maintain a todo list** for complex multi-step tasks. Update progress as you work.
- **Push after successful complex changes** - When completing a series of related changes (model + migration + command updates + tests passing), commit AND push immediately.
- **Test migrations** before committing model changes.
- **Watch for AGENTS.md files** - Check for AGENTS.md files in the project root and subdirectories. Keep them up to date when making changes to documented features, then commit and push. Note: This file is a symlink from ~/.dotfiles - push dotfiles after updating.

## Code Style

- **No comments** unless explicitly requested.
- **Follow existing patterns** in the codebase.
- **Keep responses concise** - max 4 lines unless user asks for detail.
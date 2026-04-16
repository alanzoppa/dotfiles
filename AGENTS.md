# Dotfiles

## Cross-platform support

This repo must work on both **Linux** and **macOS**.

- Use **relative paths** (e.g. `$DOTFILES_DIR`, `$HOME`) — never hardcode macOS-specific paths like `/usr/local` or `/Applications`.
- **Platform-specific** settings, aliases, PATH entries, and tooling (e.g. Homebrew, Linuxbrew, macOS `open`, Linux `xdg-open`) belong in **`.zshrc.local`**, not in shared files.
- Guard platform-specific blocks with `if [[ "$(uname)" == "Darwin" ]]` or `if [[ "$(uname)" == "Linux" ]]` when they must live in shared config.
- Never assume a tool is installed at a specific path — check with `command -v` or `[[ -f ... ]]` before sourcing or relying on it.

## Makefile

- `make setup` — full install: conflict check, submodules, symlinks, oh-my-zsh (skipped if present, `.zshrc` symlink restored after), ack (cross-platform), opencode (npx install + config symlinks)
- `make check` — conflict check only
- `make update` — rebuild links, opencode symlinks, upgrade oh-my-zsh, update submodules
- `make opencode` — symlink `opencode/` (AGENTS.md, agents, skills) into `~/.config/opencode/`
- `make opencode-unlink` — remove opencode symlinks
- `DOTFILES_DIR` is auto-detected from Makefile location
- `readlink` used without `-f` (not portable on macOS)
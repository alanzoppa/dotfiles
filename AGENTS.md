# Dotfiles

## Cross-platform support

This repo must work on both **Linux** and **macOS**.

- Use **relative paths** (e.g. `$DOTFILES_DIR`, `$HOME`) — never hardcode macOS-specific paths like `/usr/local` or `/Applications`.
- **Platform-specific** settings, aliases, PATH entries, and tooling (e.g. Homebrew, Linuxbrew, macOS `open`, Linux `xdg-open`) belong in **`.zshrc.local`**, not in shared files.
- Guard platform-specific blocks with `if [[ "$(uname)" == "Darwin" ]]` or `if [[ "$(uname)" == "Linux" ]]` when they must live in shared config.
- Never assume a tool is installed at a specific path — check with `command -v` or `[[ -f ... ]]` before sourcing or relying on it.
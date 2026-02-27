# Dotfiles

This repository contains configuration files for development tools and shells.

## Installation

```bash
cd ~
git clone {{repo}} .dotfiles
cd .dotfiles
make setup
```

**Warning**: The setup process creates symlinks in your home directory. If you have existing dotfiles with the same name, they will be replaced.

## Usage

### Manual setup

```bash
# Initialize and update submodules
git submodule init
git submodule update

# Create symlinks for all dotfiles
python3 bin/build_links.py
```

### Using the Makefile

```bash
make setup   # Full setup: submodules, symlinks, oh-my-zsh, etc.
make update  # Update submodules and pull latest changes
```

## Customization

### Local overrides

Create local override files that won't be tracked by git:

- `.zshrc.local` - Zsh local configuration
- `.vimrc.local` - Vim local configuration
- `.tmux.conf.local` - Tmux local configuration
- `.gitconfig.local` - Git local configuration (excluded from .gitignore)

These files are automatically sourced by your main config files.

### Host-specific config

For host-specific overrides, create:
- `.$(hostname)_zshrc` - Automatically sourced by `.zshrc`

## Structure

- `.zshrc` - Main Zsh configuration
- `.zsh_custom/` - Custom Zsh themes and plugins
- `.vimrc` - Vim configuration
- `.vim/` - Vim plugins (via pathogen)
- `.tmux.conf` - Tmux configuration
- `.oh-my-zsh/` - Oh My Zsh framework (submodule)
- `bin/` - Utility scripts
- `scripts/` - Additional scripts

## Troubleshooting

If you encounter symlink errors, check for existing files that might conflict:

```bash
ls -la ~/ | grep "^\."  # List all dotfiles
```

You can safely remove or back up existing dotfiles before running the setup.

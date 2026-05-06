UNAME_S := $(shell uname -s)
DOTFILES_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

OPENCODE_CONFIG := $(HOME)/.config/opencode
OPENCODE_SRC := $(DOTFILES_DIR)opencode/
OPENCODE_LINKS := AGENTS.md agents skills

IMPECCABLE_SUBMODULE := $(DOTFILES_DIR)_submodules/impeccable/.opencode/skills/impeccable
IMPECCABLE_SKILL := $(DOTFILES_DIR)opencode/skills/impeccable

.PHONY: setup check update opencode opencode-unlink impeccable-skill

setup:
	@echo "=== Dotfiles Setup ==="
	@echo "OS: $(UNAME_S)"
	@echo ""
	@echo "Checking for conflicts..."
	@bash scripts/check_conflicts.sh || (echo "Please resolve conflicts first" && exit 1)
	@echo ""
	@echo "Initializing submodules..."
	git submodule init
	git submodule update --init --recursive
	@echo ""
	@echo "Creating symlinks..."
	python3 bin/build_links.py
	@echo ""
	@echo "Setting up oh-my-zsh..."
	@if [ -d "$(HOME)/.oh-my-zsh" ]; then \
		echo "  oh-my-zsh already installed"; \
	else \
		sh .oh-my-zsh/tools/install.sh "" || true; \
		echo "  Restoring .zshrc symlink..."; \
		rm -f $(HOME)/.zshrc; \
		ln -sf $(DOTFILES_DIR).zshrc $(HOME)/.zshrc; \
	fi
	@echo ""
	@echo "Setting up ack..."
	@if command -v ack >/dev/null 2>&1; then \
		echo "  ack already installed"; \
	elif [ "$(UNAME_S)" = "Darwin" ] && command -v brew >/dev/null 2>&1; then \
		echo "  Installing ack via Homebrew"; \
		brew install ack; \
	elif [ -f /usr/bin/ack-grep ]; then \
		echo "  Installing ack (Debian/Ubuntu)"; \
		sudo ln -sf /usr/bin/ack-grep /usr/local/bin/ack 2>/dev/null || echo "  Note: Could not create symlink (may need sudo)"; \
	elif command -v apt-get >/dev/null 2>&1; then \
		echo "  Installing ack via apt (Debian/Ubuntu)"; \
		sudo apt-get update && sudo apt-get install -y ack-grep; \
	else \
		echo "  Warning: Could not detect package manager for ack"; \
		echo "  Please install ack manually:"; \
		echo "    - Debian/Ubuntu: sudo apt-get install ack-grep"; \
		echo "    - macOS: brew install ack"; \
	fi
	@echo ""
	@echo "Setting up opencode..."
	@if command -v opencode >/dev/null 2>&1 || [ -x "$(HOME)/.opencode/bin/opencode" ]; then \
		echo "  opencode already installed"; \
	elif command -v npx >/dev/null 2>&1; then \
		echo "  Installing opencode..."; \
		npx -y opencode@latest install; \
	else \
		echo "  Warning: npx not found, cannot install opencode"; \
	fi
	@$(MAKE) --no-print-directory opencode
	@$(MAKE) --no-print-directory impeccable-skill
	@echo ""
	@echo "=== Setup Complete ==="
	@echo "Run 'chsh -s /bin/zsh' to change your shell"
	@echo "Run 'zsh' or restart your terminal to apply changes"

check:
	@bash scripts/check_conflicts.sh

update:
	@echo "=== Updating Dotfiles ==="
	python3 bin/build_links.py
	@$(MAKE) --no-print-directory opencode
	@$(MAKE) --no-print-directory impeccable-skill
	@echo "Updating oh-my-zsh..."
	@sh .oh-my-zsh/tools/upgrade.sh
	@echo "Updating submodules..."
	git submodule update --init --recursive
	git submodule foreach 'git reset --hard && git checkout master && git pull'
	@echo "=== Update Complete ==="

opencode:
	@mkdir -p $(OPENCODE_CONFIG)
	@for name in $(OPENCODE_LINKS); do \
		dst="$(OPENCODE_CONFIG)/$$name"; \
		src="$(OPENCODE_SRC)$$name"; \
		if [ -L "$$dst" ]; then \
			cur=$$(readlink "$$dst"); \
			if [ "$$cur" = "$$src" ]; then \
				echo "  OK   $$dst -> $$src"; \
			else \
				rm "$$dst"; \
				ln -s "$$src" "$$dst"; \
				echo "  FIX  $$dst -> $$src (was $$cur)"; \
			fi; \
		elif [ -e "$$dst" ]; then \
			echo "  SKIP $$dst exists and is not a symlink"; \
		else \
			ln -s "$$src" "$$dst"; \
			echo "  LINK $$dst -> $$src"; \
		fi; \
	done

opencode-unlink:
	@for name in $(OPENCODE_LINKS); do \
		dst="$(OPENCODE_CONFIG)/$$name"; \
		if [ -L "$$dst" ]; then \
			rm "$$dst"; \
			echo "  RM   $$dst"; \
		fi; \
	done

impeccable-skill:
	@sub="$(IMPECCABLE_SUBMODULE)"; \
	skill="$(IMPECCABLE_SKILL)"; \
	if [ ! -d "$$sub" ]; then \
		echo "  SKIP impeccable submodule not found at $$sub"; \
	else \
		mkdir -p "$$skill"; \
		for subdir in reference scripts; do \
			dst="$$skill/$$subdir"; \
			src="$$sub/$$subdir"; \
			rel=$$(python3 -c "import os.path; print(os.path.relpath('$$src','$$skill'))"); \
			if [ -L "$$dst" ]; then \
				cur=$$(readlink "$$dst"); \
				if [ "$$cur" = "$$rel" ]; then \
					echo "  OK   $$dst -> $$rel"; \
				else \
					rm "$$dst"; \
					ln -s "$$rel" "$$dst"; \
					echo "  FIX  $$dst -> $$rel (was $$cur)"; \
				fi; \
			elif [ -e "$$dst" ]; then \
				echo "  SKIP $$dst exists and is not a symlink"; \
			else \
				ln -s "$$rel" "$$dst"; \
				echo "  LINK $$dst -> $$rel"; \
			fi; \
		done; \
	fi
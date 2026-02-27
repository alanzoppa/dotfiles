# Dotfiles Makefile
# Platform detection and setup

# Detect OS
UNAME_S := $(shell uname -s)

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
	sh .oh-my-zsh/tools/install.sh
	@echo ""
	@echo "Setting up ack..."
	@# Platform-specific ack setup
	@if command -v ack >/dev/null 2>&1; then \
		echo "  ack already installed"; \
	elif [ -f /usr/bin/ack-grep ]; then \
		echo "  Installing ack (Debian/Ubuntu)"; \
		sudo ln -sf /usr/bin/ack-grep /usr/local/bin/ack 2>/dev/null || echo "  Note: Could not create symlink (may need sudo)"; \
	elif [ -f /usr/local/bin/ack-grep ]; then \
		echo "  Installing ack (Homebrew)"; \
		sudo ln -sf /usr/local/bin/ack-grep /usr/local/bin/ack 2>/dev/null || echo "  Note: Could not create symlink (may need sudo)"; \
	elif command -v brew >/dev/null 2>&1; then \
		echo "  Installing ack via Homebrew"; \
		brew install ack; \
	elif command -v apt-get >/dev/null 2>&1; then \
		echo "  Installing ack via apt (Debian/Ubuntu)"; \
		sudo apt-get update && sudo apt-get install -y ack-grep; \
	elif command -v yum >/dev/null 2>&1; then \
		echo "  Installing ack via yum (RHEL/CentOS)"; \
		sudo yum install -y ack; \
	elif command -v dnf >/dev/null 2>&1; then \
		echo "  Installing ack via dnf (Fedora)"; \
		sudo dnf install -y ack; \
	elif command -v pacman >/dev/null 2>&1; then \
		echo "  Installing ack via pacman (Arch)"; \
		sudo pacman -S --noconfirm ack; \
	else \
		echo "  Warning: Could not detect package manager"; \
		echo "  Please install ack manually:"; \
		echo "    - Debian/Ubuntu: sudo apt-get install ack-grep"; \
		echo "    - macOS: brew install ack"; \
		echo "    - Fedora: sudo dnf install ack"; \
		echo "    - Arch: sudo pacman -S ack"; \
	fi
	@echo ""
	@echo "Setting up exuberant-ctags..."
	@if command -v ctags >/dev/null 2>&1; then \
		echo "  ctags already installed"; \
	elif command -v brew >/dev/null 2>&1; then \
		echo "  Installing ctags via Homebrew"; \
		brew install ctags; \
	elif command -v apt-get >/dev/null 2>&1; then \
		echo "  Installing ctags via apt (Debian/Ubuntu)"; \
		sudo apt-get update && sudo apt-get install -y exuberant-ctags; \
	elif command -v yum >/dev/null 2>&1; then \
		echo "  Installing ctags via yum (RHEL/CentOS)"; \
		sudo yum install -y ctags; \
	elif command -v dnf >/dev/null 2>&1; then \
		echo "  Installing ctags via dnf (Fedora)"; \
		sudo dnf install -y ctags; \
	elif command -v pacman >/dev/null 2>&1; then \
		echo "  Installing ctags via pacman (Arch)"; \
		sudo pacman -S --noconfirm ctags; \
	else \
		echo "  Warning: Could not detect package manager"; \
		echo "  Please install exuberant-ctags manually:"; \
		echo "    - Debian/Ubuntu: sudo apt-get install exuberant-ctags"; \
		echo "    - macOS: brew install ctags"; \
		echo "    - Fedora: sudo dnf install ctags"; \
		echo "    - Arch: sudo pacman -S ctags"; \
	fi
	@echo ""
	@echo "=== Setup Complete ==="
	@echo "Run 'chsh -s /bin/zsh' to change your shell"
	@echo "Run 'zsh' or restart your terminal to apply changes"

check:
	@bash scripts/check_conflicts.sh

update:
	@echo "=== Updating Dotfiles ==="
	python3 bin/build_links.py
	@echo "Updating oh-my-zsh..."
	sh .oh-my-zsh/tools/upgrade.sh
	@echo "Updating submodules..."
	git submodule update --init --recursive
	git submodule foreach git reset --hard && git checkout master && git pull
	@echo "=== Update Complete ==="



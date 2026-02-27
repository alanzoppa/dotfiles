setup:
	@echo "Checking for conflicts..."
	@bash scripts/check_conflicts.sh || (echo "Please resolve conflicts first" && exit 1)
	@echo "Initializing submodules..."
	git submodule init
	git submodule update
	@echo "Creating symlinks..."
	python3 bin/build_links.py
	@echo "Setting up oh-my-zsh..."
	sh .oh-my-zsh/tools/install.sh
	@echo "Setting up ack..."
	if [ -f /usr/bin/ack-grep ]; then sudo ln -sf /usr/bin/ack-grep /usr/local/bin/ack; fi
	@echo "Setup complete!"
	@echo "Run 'chsh -s /bin/zsh' to change your shell"
	@echo "Run 'zsh' to restart your shell"

check:
	@bash scripts/check_conflicts.sh

update:
	python bin/build_links.py
	sh .oh-my-zsh/tools/upgrade.sh
	git submodule update
	git submodule foreach git reset --hard && git checkout master && git pull

update:
	python bin/build_links.py
	sh .oh-my-zsh/tools/upgrade.sh
	git submodule update
	git submodule foreach git reset --hard && git checkout master && git pull

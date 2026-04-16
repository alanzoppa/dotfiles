OPENCODE_CONFIG := $(HOME)/.config/opencode
OPENCODE_SRC    := $(DOTFILES_DIR)/opencode
OPENCODE_LINKS  := AGENTS.md agents skills

.PHONY: opencode opencode-unlink

opencode:
	@mkdir -p $(OPENCODE_CONFIG)
	@for name in $(OPENCODE_LINKS); do \
		dst="$(OPENCODE_CONFIG)/$$name"; \
		src="$(OPENCODE_SRC)/$$name"; \
		if [ -L "$$dst" ]; then \
			cur=$$(readlink "$$dst"); \
			if [ "$$cur" = "$$src" ]; then \
				echo "  OK   $$dst → $$src"; \
			else \
				rm "$$dst"; \
				ln -s "$$src" "$$dst"; \
				echo "  FIX  $$dst → $$src (was $$cur)"; \
			fi; \
		elif [ -e "$$dst" ]; then \
			echo "  SKIP $$dst exists and is not a symlink"; \
		else \
			ln -s "$$src" "$$dst"; \
			echo "  LINK $$dst → $$src"; \
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
#!/bin/bash
# Check for potential dotfile conflicts

set -e

echo "Checking for potential dotfile conflicts..."
echo ""

CONFLICTS=()
for file in ~/.dotfiles/*; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        if [[ -e ~/"$filename" && ! -L ~/"$filename" ]]; then
            CONFLICTS+=("$filename")
        fi
    fi
done

if [[ ${#CONFLICTS[@]} -eq 0 ]]; then
    echo "✓ No conflicts detected!"
    exit 0
else
    echo "⚠ Potential conflicts found:"
    for conflict in "${CONFLICTS[@]}"; do
        echo "  - ~/$conflict already exists (not a symlink)"
    done
    echo ""
    echo "To resolve:"
    echo "  1. Back up your existing files: mv ~/\$FILE ~/\$FILE.bak"
    echo "  2. Run the setup: make setup"
    echo "  3. Or manually create symlinks"
    exit 1
fi
#!/bin/bash
# Disk cleanup script - runs daily to reclaim space from caches and old packages

set -e

LOG_FILE="$HOME/.dotfiles/logs/disk_cleanup.log"
BEFORE=$(df -k / | awk 'NR==2 {print $4}')

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Disk cleanup started ==="

# npm cache
log "Cleaning npm cache..."
npm cache clean --force >> "$LOG_FILE" 2>&1 || true

# pip cache
log "Cleaning pip cache..."
rm -rf ~/.cache/pip >> "$LOG_FILE" 2>&1 || true

# qmd cache (preserve models/ - shared across all agents via symlinkSharedModels)
# Skipping to avoid breaking the shared model symlinks

# apt cache
log "Cleaning apt cache..."
sudo apt clean >> "$LOG_FILE" 2>&1 || true

# remove old kernel
log "Removing old kernel packages..."
sudo apt autoremove -y >> "$LOG_FILE" 2>&1 || true

# journal vacuum
log "Vacuuming journal logs..."
sudo journalctl --vacuum-size=50M >> "$LOG_FILE" 2>&1 || true

AFTER=$(df -k / | awk 'NR==2 {print $4}')
FREED_KB=$((BEFORE - AFTER))

log "Freed approximately $((FREED_KB / 1024))MB"
log "=== Disk cleanup complete ==="

#!/bin/bash
# Update dotfiles and submodules

set -e

cd ~/.dotfiles

echo "Fetching latest changes from remote..."
git fetch origin

echo "Pulling latest changes..."
git pull origin master

echo "Updating submodules..."
git submodule update --init --recursive

echo "Rebuilding symlinks..."
python3 bin/build_links.py

echo "Done! Restart your shell to see changes."
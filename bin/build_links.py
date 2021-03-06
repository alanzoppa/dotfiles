#!/usr/bin/python

import os
import re

# Grab everything in .dotfiles and symlink to home directory

HOME_DIR = os.environ['HOME']
THIS_FILE = os.path.abspath(__file__)
FILENAME = re.sub('.*/', '', THIS_FILE)
DOTFILES_LOCATION = re.sub("/bin/%s" % FILENAME, '', THIS_FILE)
IGNOREABLE_FILES = [ 'bin', '.git', '.gitignore', 'README.md', 'Makefile']

dotfiles = os.listdir(DOTFILES_LOCATION)

for file in IGNOREABLE_FILES:
    try:
        dotfiles.remove(file)
    except OSError:
        pass

for f in dotfiles:
    source = "%s/%s" % (DOTFILES_LOCATION, f)
    destination = "%s/%s" % (HOME_DIR, f)
    try:
        os.unlink(destination)
    except OSError:
        print(source, destination)
        pass
    os.symlink(source, destination)

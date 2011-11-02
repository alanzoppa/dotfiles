## Instructions

* Make sure you don't have anything important in your dotfiles. They will be deleted.
* cd
* git clone {{repo}} .dotfiles
* cd .dotfiles
* python bin/build_links.py

## First-time instructions
* above plus the following
* cd ~/.vim
* vim command-t-1.2.1.vba
* (in vim) :so %
* cd ~/.vim/ruby/command-t
* ruby extconf.rb (this will fail without ruby-dev)
* make

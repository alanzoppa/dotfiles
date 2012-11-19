setup:
	python bin/build_links.py
	sh .oh-my-zsh/tools/install.sh
	sh .oh-my-zsh/tools/upgrade.sh
	rvm install ruby-1.9.3-p194
	rvm use --default ruby-1.9.3-p194
	gem install tmuxinator

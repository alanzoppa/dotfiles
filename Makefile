setup:
	git submodule init
	make update
	sudo apt-get install zsh tmux
	curl -L https://get.rvm.io | bash -s stable --ruby
	sh .oh-my-zsh/tools/install.sh
	gem install tmuxinator

update:
	git submodule update
	rvm get latest
	rvm install ruby-1.9.3-p194
	rvm use --default ruby-1.9.3-p194
	python bin/build_links.py
	sh .oh-my-zsh/tools/upgrade.sh

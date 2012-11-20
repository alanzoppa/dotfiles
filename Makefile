setup:
	git submodule init
	git submodule update
	python bin/build_links.py
	sudo apt-get install -y zsh tmux libtool ncurses-dev readline python-pip libyaml-0-2
	sudo pip install virtualenvwrapper
	curl -L https://get.rvm.io | bash -s stable --ruby
	rvm pkg install libyaml
	rvm pkg install readline
	rvm pkg install zlib --verify-downloads 1
	make standardize_rvm
	sh .oh-my-zsh/tools/install.sh
	gem install tmuxinator

standardize_rvm:
	rvm get latest
	rvm install ruby-1.9.3-p327
	rvm use --default ruby-1.9.3-p327

update:
	git submodule update
	make standardize_rvm
	python bin/build_links.py
	sh .oh-my-zsh/tools/upgrade.sh

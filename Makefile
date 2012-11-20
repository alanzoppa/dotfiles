setup:
	git submodule init
	git submodule update
	python bin/build_links.py
	sudo apt-get install -y tmux libtool ncurses-dev libreadline-ruby libyaml-dev vim-full exuberant-ctags mercurial
	make setup_vim
	make setup_zsh
	curl -L https://get.rvm.io | bash -s stable --ruby
	chsh --shell /bin/zsh
	zsh
	mkdir $HOME/tmp
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

setup_vim:
	cd ~/tmp && hg clone https://vim.googlecode.com/hg/ vim
	cd ~/tmp/vim/src && make && sudo make install

setup_zsh:
	sudo apt-get install -y autoconf
	cd ~/tmp && git clone git://zsh.git.sf.net/gitroot/zsh/zsh
	~/tmp/zsh/Util/preconfig
	~/tmp/zsh/configure
	cd ~/tmp/zsh && make && sudo make install

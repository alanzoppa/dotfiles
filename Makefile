setup:
	git submodule init
	git submodule update
	python bin/build_links.py
	sudo apt-get install -y tmux libtool ncurses-dev libreadline-ruby libyaml-dev exuberant-ctags mercurial libreadline6-dev zlib1g-dev libssl-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev autoconf libgdbm-dev automake libffi-dev
	curl -L https://get.rvm.io | bash -s stable --ruby
	chsh --shell /usr/bin/zsh
	zsh
	mkdir /home/alan/tmp
	rvm pkg install libyaml
	rvm pkg install readline
	rvm pkg install zlib --verify-downloads 1
	make standardize_rvm
	sh .oh-my-zsh/tools/install.sh
	gem install tmuxinator
	bin/setup_anacron.sh
	sudo ln -s /usr/bin/ack-grep /usr/local/bin/ack

standardize_rvm:
	rvm get latest
	rvm install ruby-1.9.3-p327
	rvm use --default ruby-1.9.3-p327

update:
	make standardize_rvm
	python bin/build_links.py
	sh .oh-my-zsh/tools/upgrade.sh
	git submodule update
	git submodule foreach git reset --hard && git checkout master && git pull

setup_vim:
	cd ~/tmp && hg clone https://vim.googlecode.com/hg/ vim
	cd ~/tmp/vim/src && make && sudo make install

setup_zsh:
	sudo apt-get install -y autoconf
	cd ~/tmp && git clone git://zsh.git.sf.net/gitroot/zsh/zsh
	~/tmp/zsh/Util/preconfig
	~/tmp/zsh/configure
	cd ~/tmp/zsh && make && sudo make install

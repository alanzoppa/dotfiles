setup:
	git submodule init
	git submodule update
	python bin/build_links.py
	sudo apt-get install -y tmux libtool ncurses-dev libyaml-dev exuberant-ctags mercurial libreadline6-dev zlib1g-dev libssl-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev autoconf libgdbm-dev automake libffi-dev
	chsh --shell /usr/bin/zsh
	zsh
	mkdir /home/alan/tmp
	sh .oh-my-zsh/tools/install.sh
	gem install tmuxinator
	bin/setup_anacron.sh
	sudo ln -s /usr/bin/ack-grep /usr/local/bin/ack
	hg clone https://vim.googlecode.com/hg/ ~/vim
	cd ~/vim/src
	make
	sudo make install
	sudo rm /usr/bin/vim
	sudo ln -s /usr/local/bin/vim /usr/bin/vim
	rm -rf ~/vim

update:
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

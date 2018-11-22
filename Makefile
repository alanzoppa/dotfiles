setup:
	git submodule init
	git submodule update
	python bin/build_links.py
	chsh -s /bin/zsh
	zsh
	mkdir /home/alan/tmp
	sh .oh-my-zsh/tools/install.sh
	sudo ln -s /usr/bin/ack-grep /usr/local/bin/ack

update:
	python bin/build_links.py
	sh .oh-my-zsh/tools/upgrade.sh
	git submodule update
	git submodule foreach git reset --hard && git checkout master && git pull

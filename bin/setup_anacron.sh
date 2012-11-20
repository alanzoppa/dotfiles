if grep --quiet cron.daily.dotfiles /etc/anacrontab; then
    echo "Anacron setup complete"
else
    #ME=$(whoami)
    #sudo su &&
    echo "1 0 cron.daily.dotfiles nice run-parts --report $DOTFILES_DIR/cron.daily" | sudo tee -a /etc/anacrontab
    #sudo su $ME
fi

# Path to your oh-my-zsh configuration.

#DISABLE_AUTO_UPDATE="true"

#COMPLETION_WAITING_DOTS="true"

#function tea {
    #sleep $1 | pv -t -N "Tea steeping for" && say "Tea is ready" && zenity --info --text="Tea is ready"
#}

#export TERM='xterm-256color'
#autoload -U compinit && compinit
#[[ -s $HOME/.tmuxinator/scripts/tmuxinator ]] && source $HOME/.tmuxinator/scripts/tmuxinator

#PATH="/usr/local/share/npm/bin:$PATH"
#PATH="~/local_dev/8b/bin:$PATH"
#PATH=$PATH:/usr/local/sbin

alias lt='ls -t'
alias lta='ls -ta'

setopt auto_cd
setopt auto_pushd



autoload -U compinit && compinit 
autoload -U edit-command-line
zle -N edit-command-line
bindkey '^x^e' edit-command-line

git config --global alias.l "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%C(bold blue)<%an>%Creset' --abbrev-commit"
export ZSH=$HOME/.oh-my-zsh 
export ZSH_CUSTOM=$HOME/.zsh_custom
plugins=(git battery debian django rails python)
export ZSH_THEME='alantheme'
export DOTFILES_DIR=$HOME/.dotfiles
export CHROMIUM_USER_FLAGS="--disk-cache-dir=/tmp/chrome/cache --disk-cache-size=419430400"
function ssh-copy-id {
    cat ~/.ssh/id_rsa.pub | ssh $1 "cat >> ~/.ssh/authorized_keys"
}

bindkey -e
bindkey '^[[1;9C' forward-word
bindkey '^[[1;9D' backward-word

source $ZSH/oh-my-zsh.sh

source ~/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

if [[ -a ~/.$(hostname)_zshrc ]]; then
    source ~/.$(hostname)_zshrc
fi

### Added by the Heroku Toolbelt
#export PATH="/usr/local/heroku/bin:$PATH"
#export PATH=/usr/local/bin:${PATH}:/Users/alan/android/sdk/tools:/Users/alan/android/sdk/platform-tools
#export ANT_HOME=/usr/local/Cellar/ant/1.9.2/bin/ant
#export FIX_VPN_POW=yes
#export FIX_VPN_MINIRAISER=yes
#export PGHOST=localhost

#export PATH=/usr/local/bin:$PATH
#export PYENV_ROOT="$HOME/.pyenv"
#export PATH="$PYENV_ROOT/bin:$PATH"


#command -v pyenv >/dev/null 2>&1 && eval "$(pyenv init -)" && eval "$(pyenv virtualenv-init -)" 

#source /usr/local/share/chruby/chruby.sh



#export PATH=/Users/alan/torch/install/bin:$PATH  # Added automatically by torch-dist
#export LD_LIBRARY_PATH=/Users/alan/torch/install/lib:$LD_LIBRARY_PATH  # Added automatically by torch-dist

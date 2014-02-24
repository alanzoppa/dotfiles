# Path to your oh-my-zsh configuration.
HOSTNAME="$(cat /etc/hostname)"

DISABLE_AUTO_UPDATE="true"

COMPLETION_WAITING_DOTS="true"

# this tests for the presence of rvm 
# if its loaded, it'll add the prompt
function rvm_info_for_prompt {
  ruby_version=$(~/.rvm/bin/rvm-prompt)
  if [ -n "$ruby_version" ]; then
    echo "[$ruby_version]"
  fi
}

function tea {
    sleep $1 | pv -t -N "Tea steeping for" && say "Tea is ready" && zenity --info --text="Tea is ready"
}

export TERM='xterm-256color'
autoload -U compinit && compinit
PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"
[[ -s $HOME/.tmuxinator/scripts/tmuxinator ]] && source $HOME/.tmuxinator/scripts/tmuxinator

PATH="/usr/local/share/npm/bin:$PATH"
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
plugins=(git battery debian django rails python rvm)
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

. /usr/local/bin/z

if [[ -a ~/.${HOSTNAME}_zshrc ]]; then
    source ~/.${HOSTNAME}_zshrc
fi

### Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"

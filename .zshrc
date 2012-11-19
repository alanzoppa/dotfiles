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



export TERM='xterm-256color'

autoload -U compinit && compinit


__git_files () { 
    _wanted files expl 'local files' _files     
}
source ~/.git-completion.sh

PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"

alias lt='ls -t'
alias lta='ls -ta'

setopt auto_cd
setopt auto_pushd

autoload -U edit-command-line
zle -N edit-command-line
bindkey '^x^e' edit-command-line

export ZSH=$HOME/.oh-my-zsh 
export ZSH_CUSTOM=$HOME/.zsh_custom
plugins=(git battery debian django rails python rvm virtualenvwrapper)
export ZSH_THEME='alantheme'

source $ZSH/oh-my-zsh.sh

if [[ -a ~/.${HOSTNAME}_zshrc ]]; then
    source ~/.${HOSTNAME}_zshrc
fi

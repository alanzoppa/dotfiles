# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh
HOSTNAME="$(cat /etc/hostname)"

ZSH_THEME="gentoo"

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


plugins=(git battery debian django rails python rvm)

export TERM='xterm-256color'

autoload -U compinit && compinit

source $ZSH/oh-my-zsh.sh

__git_files () { 
    _wanted files expl 'local files' _files     
}
source ~/.git-completion.sh

PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
[[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"

PS1='%(!.%{$fg_bold[red]%}.%{$fg_bold[green]%}%n@)%m %{$fg_bold[blue]%}%(!.%1~.%~) $(rvm_info_for_prompt) $(current_branch)%#%{$reset_color%} '

setopt auto_cd
setopt auto_pushd

autoload -U edit-command-line
zle -N edit-command-line
bindkey '^x^e' edit-command-line

source.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh 


if [[ -a ~/.${HOSTNAME}_zshrc ]]; then
    source ~/.${HOSTNAME}_zshrc
fi



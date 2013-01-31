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
    sleep $1 | pv -t -N "Tea steeping for" && notify-send "Tea is ready"
}

function say { echo $@ | festival --tts } 

export TERM='xterm-256color'

autoload -U compinit && compinit 

export ZSH=$HOME/.oh-my-zsh 
export ZSH_CUSTOM=$HOME/.zsh_custom
plugins=(git battery debian django rails python rvm)
export ZSH_THEME='alantheme'
export DOTFILES_DIR=$HOME/.dotfiles
export CHROMIUM_USER_FLAGS="--disk-cache-dir=/tmp/chrome/cache --disk-cache-size=419430400"


source $ZSH/oh-my-zsh.sh

if [[ -a ~/.${HOSTNAME}_zshrc ]]; then
    source ~/.${HOSTNAME}_zshrc
fi

# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh
HOSTNAME="$(cat /etc/hostname)"

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
#ZSH_THEME="robbyrussell"
ZSH_THEME="gentoo"

# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Comment this out to disable weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
COMPLETION_WAITING_DOTS="true"

AUTO_CD="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git battery bundler debian django rails python)

export TERM='xterm-256color'

# Customize to your needs...
#
#
#
autoload -U compinit && compinit

if [[ -a ~/.${HOSTNAME}_zshrc ]]; then
    source ~/.${HOSTNAME}_zshrc
fi


source $ZSH/oh-my-zsh.sh

__git_files () { 
    _wanted files expl 'local files' _files     
}
source ~/.git-completion.sh

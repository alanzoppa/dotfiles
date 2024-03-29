#vim: setfiletype zsh

function rvm_char {
    echo ' ★'
}

function prompt_char {
    #echo '↪'
    #echo '⚡'
    #echo '‽'
    #echo '☢'
    #echo '☠'
    #echo '☭'
    #echo '⨁'
    #echo '☣'
    #echo '⚛'
    #echo 'ॐ '
    #echo '↯'
    #echo '☯'
    #echo '☘'
    echo '人'
}

function point_char {
    #echo '⇒'
    #echo '☞'
    #echo '⟶ '
    #echo '⤑ '
    #echo '⤳'
    #echo ''
    #echo '↬'
    #echo '~'
    #echo '⇶'
    #echo '⇥'
}

function virtualenv_info {
    [ $VIRTUAL_ENV ] && echo '('`basename $VIRTUAL_ENV`') '
}

function collapse_pwd {
    echo $(pwd | sed -e "s,^$HOME,~,")
}

PROMPT='%{$fg_bold[blue]%}%n%{$reset_color%}%{$fg_bold[cyan]%}@%{$reset_color%}%{$fg_bold[blue]%}%m%{$reset_color%} %{$fg_bold[yellow]%}nvm: $(nvm_version)%{$reset_color%} %{$fg_bold[green]%}py: $(pyenv_prompt_info) %{$reset_color%}%{$fg_bold[cyan]%}${PWD/#$HOME/~}%{$reset_color%}$(git_prompt_info)%{$reset_color%}  
%{$fg_bold[red]%}$(prompt_char)%{$reset_color%}%{$fg_bold[white]%}$(point_char)%{$reset_color%} '


ZSH_THEME_GIT_PROMPT_PREFIX="  %{$fg_bold[magenta]%}⊸ "
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg_bold[green]%}"
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg_bold[green]%}?"
ZSH_THEME_GIT_PROMPT_CLEAN=""

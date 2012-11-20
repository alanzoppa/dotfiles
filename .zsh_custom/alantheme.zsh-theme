#vim: setfiletype zsh

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
    echo 'ॐ '
}

function point_char {
    #echo '⇒'
    #echo '☞'
    #echo '⟶ '
    echo '⤑ '
}

function virtualenv_info {
    [ $VIRTUAL_ENV ] && echo '('`basename $VIRTUAL_ENV`') '
}

function collapse_pwd {
    echo $(pwd | sed -e "s,^$HOME,~,")
}

if which rvm-prompt &> /dev/null; then
  PROMPT='%{$fg_bold[blue]%}人%n%{$reset_color%}%{$fg_bold[cyan]%}@%{$reset_color%}%{$fg_bold[blue]%}%m%{$reset_color%} %{$fg_bold[cyan]%}で${PWD/#$HOME/~}%{$reset_color%}$(git_prompt_info) %{$reset_color%}%{$fg_bold[red]%}ルビ$(~/.rvm/bin/rvm-prompt)%{$reset_color%} 
$(virtualenv_info)%{$fg_bold[white]%}$(prompt_char)%{$reset_color%}%{$fg_bold[white]%}$(point_char)%{$reset_color%} '
fi


ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[magenta]%} 於"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg_bold[green]%}"
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg_bold[green]%}?"
ZSH_THEME_GIT_PROMPT_CLEAN=""

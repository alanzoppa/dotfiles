function prompt_char {
    git branch >/dev/null 2>/dev/null && echo 'ॐ;' && return
    hg root >/dev/null 2>/dev/null && echo 'Hg' && return
    echo 'ॐ;'
}

function virtualenv_info {
    [ $VIRTUAL_ENV ] && echo '('`basename $VIRTUAL_ENV`') '
}

function collapse_pwd {
    echo $(pwd | sed -e "s,^$HOME,~,")
}

if which rvm-prompt &> /dev/null; then
  PROMPT='%{$fg_bold[blue]%}%n%{$reset_color%}%{$fg_bold[cyan]%}@%{$reset_color%}%{$fg_bold[blue]%}%m%{$reset_color%} in %{$fg_bold[cyan]%}${PWD/#$HOME/~}%{$reset_color%}$(git_prompt_info) using %{$reset_color%}%{$fg_bold[red]%}$(~/.rvm/bin/rvm-prompt)%{$reset_color%} 
$(virtualenv_info)%{$fg[white]%}$(prompt_char)%{$reset_color%} '
else
  /*if which rbenv &> /dev/null; then*/
    /*PROMPT='%{$fg_bold[magenta]%}%n%{$reset_color%}%{$fg_bold[white]%}@%{$reset_color%}%{$fg_bold[yellow]%}%m%{$reset_color%} in %{$fg_bold[green]%}${PWD/#$HOME/~}%{$reset_color%}$(git_prompt_info) using %{$reset_color%}%{$fg_bold[red]%}$(rbenv version | sed -e "s/ (set.*$//")%{$reset_color%} */
/*$(virtualenv_info)%{$fg[white]%}$(prompt_char)%{$reset_color%} '*/
  /*fi*/
fi


ZSH_THEME_GIT_PROMPT_PREFIX=" on %{$fg_bold[magenta]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg_bold[green]%}"
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg_bold[green]%}?"
ZSH_THEME_GIT_PROMPT_CLEAN=""

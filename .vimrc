let mapleader = ";"

map <F2> :NERDTreeToggle<CR>
map <Leader>f :NERDTreeToggle<CR>
map <S-F2> :TlistToggle<CR>
map <F3> :tabp<CR>
map <F4> :tabn<CR>
imap <M-j> <Esc>
imap <D-j> <Esc>
imap <M-k> <C-x><C-o>
imap <D-k> <C-x><C-o>
map <Leader>r :! rspec ./spec/<CR>
map <Leader>p :! ez-promote %<CR>
map <Leader>e :! p4 edit %<CR>
map <Leader>a :! p4 add % && chmod +w %<CR>
map <Leader>s :w !sudo tee %<CR>
vmap <Leader>g y:Ack " *<CR>
map <F11> :call DoWordComplete()<CR>
map <F12> :call EndWordComplete()<CR>
map <F6> :setfiletype html<CR>
map <F7> :call Rebuild_tags()<CR><CR>
map <Leader>a ggVG
map <Leader>tt :hi Normal ctermbg=none<CR>
map <Leader>oo :color zenburn<CR>
map <Leader>l :tabn<CR>
map <Leader>j :tabp<CR>

vnoremap < <gv
vnoremap > >gv
vnoremap p pgvy

call pathogen#infect()
call pathogen#helptags() 

":Arpeggio inoremap jk <Esc>
call arpeggio#map('i', '', 0, 'jk', '<Esc>')
call arpeggio#map('i', '', 0, 'JK', '<Esc>')

set wildignore+=/media/**,*//home/alan/media/**,*//home/alan/Music/**,*/*.scssc
"set wildignore+=*/.git/* " This line breaks fugitive.vim
set wildignore+=*.pyc,*/*.scssc
set wildignore+=*/cabar/*,*/cnu_active_record/*,*/cnuapp_ci/*,*/cnuapp_doc/*,*/cnuapp_env/*
set wildignore+=*/cnuapp_qa/*,*/cnuapp_rack/*,*/cnu_bloom/*,*/cnu_brand/*,*/cnu_cluster/*
set wildignore+=*/cnu_config/*,*/cnu_content/*,*/cnu_database/*,*/cnu_gems/*,*/cnu_ivr/*
set wildignore+=*/cnu_ldap/*,*/cnu_locale/*,*/cnu_logger/*,*/cnu_memcache/*,*/cnu_perf/*
set wildignore+=*/cnu_pg/*,*/cnu_product_offering/*,*/cnu_rails_app/*,*/cnu_regexp/*
set wildignore+=*/cnu_ruby_build/*,*/cnu_ruby_core/*,*/cnu_ruby_lib/*,*/cnu_scm/*
set wildignore+=*/cnu_selenium/*,*/cnu_service/*,*/cnu_space/*,*/cnu_test/*,*/contenter_api/*
set wildignore+=*/cookbooks/*,*/db_global/*,*/doc/*,*/enf_app/*,*/enf_log/*,*/lsws-3.3.14/*
set wildignore+=*/mod_rails/*,*/rails-1.2/*,*/red_steak/*,*/screenshots/*,*/shout_trace/*
set wildignore+=*/sol_api/*,*/trick_serial/*,*/waffles/*,*/wtf/*
set wildignore+=*static/CACHE/css/*
"stuff in cnuapp
set wildignore+=*/cnuapp/apache/*,*/cnuapp/bin/*
set wildignore+=*/cnuapp/debian/*,*/cnuapp/gems/*,*/cnuapp/gui/*,*/cnuapp/include/*
set wildignore+=*/cnuapp/locproot/*,*/cnuapp/lsws/*,*/cnuapp/noderoot/*
set wildignore+=*/cnuapp/plugins/*,*/cnuapp/queries/*,*/cnuapp/Rakefile/*,*/cnuapp/Rakefile.US/*
set wildignore+=*/cnuapp/result.GB/*,*/cnuapp/result.GB.fail/*,*/cnuapp/result.GB.last/*
set wildignore+=*/cnuapp/result.GB.pass/*,*/cnuapp/script/*,*/cnuapp/src/*
set wildignore+=*/cnuapp/tmp/*,*/cnuapp/tools/*,*/cnuapp/typeroot/*,*/cnuapp/var/*
set wildignore+=*/cnuapp/vendor/*
set wildignore+=*.jpg,*.bmp,*.gif,*.png,*.jpeg
set wildignore+=*node_modules*

let g:ctrlp_max_files = 0
let g:ctrlp_max_depth = 1000
let g:ctrlp_max_height = 50
let g:ctrlp_working_path_mode = 0
let g:ctrlp_clear_cache_on_exit = 0 
let g:ctrlp_open_multiple_files = 't'

let g:ctrlp_custom_ignore = {
	\ 'dir':  '\.git$\|\.hg$\|\.svn$',
	\} 


set autoindent
set backspace=indent,eol,start
set completeopt=menu
set colorcolumn=81
set dictionary=/usr/share/dict/words

set expandtab
set history=300
set incsearch
set modeline
set nocompatible
set ruler
set showcmd
set showmatch
set sw=4
set tabpagemax=30
set ts=4
set so=7
set wildmenu
set wildmode=longest,list,full
set ignorecase
set smartcase
set number
set relativenumber

syn on

let NERDTreeDirArrows=0
if has("gui_running")
  let NERDTreeDirArrows=1
  set spellfile=~/.vim/spellfile.add
  setlocal spell spelllang=en_us
  set spell
  set guioptions-=m
  set guioptions-=T
  let g:no_html_toolbar = 'yes'
  set cursorline
endif

if has("gui_macvim")
    let Tlist_Ctags_Cmd='/opt/local/bin/ctags'
    set gfn=Menlo\ Regular:h14
endif

filetype on
filetype plugin on
filetype indent on 
set ofu=syntaxcomplete#Complete 

set dir=/tmp//,.

set background=dark

hi Search		  ctermbg=red		ctermfg=0		cterm=none
hi IncSearch 	  ctermbg=red		ctermfg=0		cterm=none

" When vimrc is edited, reload it
autocmd! bufwritepost vimrc source ~/.vimrc

let NERDTreeIgnore=['.pyc$',]

function! Set_htmldjango()
    if filereadable('settings.py') && filereadable('../manage.py')
        setfiletype htmldjango
    endif
endfunction

let g:closetag_html_style=1

au BufEnter *.html :call Set_htmldjango()
"
autocmd BufRead *.txt set lbr
autocmd FileType gitcommit DiffGitCached | wincmd = | wincmd p

au BufEnter * :silent! %foldo!

set background=dark
set term=screen-256color
let g:zenburn_high_Contrast=1
color zenburn
set guifont=Inconsolata:h14

let html_use_css = 1
let html_no_pre = 1
hi Normal ctermbg=none

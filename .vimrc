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
map <Leader>r :! rspec %<CR>
map <Leader>p :! ez-promote %<CR>
map <Leader>e :! p4 edit %<CR>
map <Leader>a :! p4 add % && chmod +w %<CR>
map <Leader>s :w !sudo tee %<CR>
vmap <Leader>g y:Ack " *<CR>
map <F11> :call DoWordComplete()<CR>
map <F12> :call EndWordComplete()<CR>
map <F6> :setfiletype html<CR>
map <F7> :call Rebuild_tags()<CR><CR>

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

let g:ctrlp_max_files =0
let g:ctrlp_max_depth =1000
let g:ctrlp_max_height = 50
let g:ctrlp_working_path_mode = 0

let g:CommandTMaxFiles=50000


set autoindent
set backspace=indent,eol,start
set completeopt=menu

set dictionary=/usr/share/dict/words
"set complete-=k complete+=k


set expandtab
set history=300
set incsearch
set modeline
set nocompatible
set ruler
set showcmd
set showmatch
set smartindent
set sw=4
set tabpagemax=30
set ts=4
set so=7
set wildmenu
syn on

if has("gui_running")
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

function! Rebuild_tags ()
    if filereadable('settings.py') && filereadable('manage.py')
        silent! !ctags -R --exclude=*.sql --exclude=*.tar . &
    endif
endfunction

function! Set_htmldjango()
    if filereadable('settings.py') && filereadable('manage.py')
        setfiletype htmldjango
    endif
endfunction


    "augroup EditHTML
		"autocmd!
        "autocmd FileType html set omnifunc=htmlcomplete#CompleteTags
    "augroup END


let g:closetag_html_style=1

"au FileType python set omnifunc=pythoncomplete#Complete
"au FileType javascript set omnifunc=javascriptcomplete#CompleteJS
"au FileType html set omnifunc=htmlcomplete#CompleteTags
"au FileType css set omnifunc=csscomplete#CompleteCSS
"au FileType xml set omnifunc=xmlcomplete#CompleteTags
"au FileType php set omnifunc=phpcomplete#CompletePHP
"au FileType c set omnifunc=ccomplete#Complete
"au BufNewFile,BufRead *.j setf objj 
"au BufReadPost * :call Rebuild_tags()
"au BufReadPost * :syn on
au BufWritePost *.py,*.rb silent! !ctags -R &


"au BufWritePost *.js :call Rebuild_tags()
"au BufReadPost *.html :call Set_htmldjango()
"au Filetype html,xml,xsl,php source ~/.vim/scripts/closetag.vim 
"au BufWritePost *.scss :setfiletype sass
"
autocmd BufRead *.txt set lbr

au BufEnter * :silent! %foldo!

set term=screen-256color
let g:zenburn_high_Contrast=1
color zenburn

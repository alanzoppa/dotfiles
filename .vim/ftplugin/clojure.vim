map <Leader>lk :call VimuxClosePanes()<CR>
map <Leader>lrr :call ReloadREPL()<CR>
map <Leader>lr :call ReloadClojureEnv()<CR>
map <Leader>lv "vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>ll "vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>la ggvG$"vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>lyy 0v$"vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>lo :call RequireClojureProject()<CR>
map <Leader>lt :call TestInRepl()<CR>

"imap ( ()<Esc>ci(
"imap [ []<Esc>ci[
"imap { {}<Esc>ci{

function! ReloadREPL()
call VimuxClosePanes()
call RequireClojureProject()
endfunction

function! ReloadClojureEnv()
python << endpython
import vim
import os
path_segment = os.getcwd().split('/')[-1]
vim.command(":call VimuxRunCommand(\"(require '%s.core :reload)\")" % path_segment)
vim.command(":call VimuxRunCommand(\"(require '%s.test.core :reload)\")" % path_segment)
vim.command("return 0") 
endpython
endfunction



function! RequireClojureProject()
call VimuxRunCommand("lein repl")
python << endpython
import vim
import os
path_segment = os.getcwd().split('/')[-1]
vim.command(":call VimuxRunCommand(\"(require '%s.core :reload)\")" % path_segment)
vim.command(":call VimuxRunCommand(\"(require '%s.test.core :reload)\")" % path_segment)
vim.command(":call VimuxRunCommand(\"(ns %s.core )\")" % path_segment)
vim.command("return 0") 
endpython
endfunction

function! TestInRepl()
python << endpython
import vim
import os
path_segment = os.getcwd().split('/')[-1]
vim.command(":call VimuxRunCommand(\"(require '%s.core '%s.test.core :reload)\")" % (path_segment, path_segment))
vim.command(":call VimuxRunCommand(\"(clojure.test/run-tests '%s.test.core)\")" % path_segment)
vim.command("return 0") 
endpython
endfunction

"au BufWritePost *.clj call ReloadClojureEnv()

set sw=2
set ts=2


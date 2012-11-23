map <Leader>lo :call VimuxRunCommand("lein repl")<CR>
map <Leader>lk :call VimuxClosePanes()<CR>
map <Leader>lv "vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>ll "vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>la ggvG$"vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>lyy 0v$"vy :call VimuxRunCommand(@v . "\n", 0)<CR>



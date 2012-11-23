map <Leader>lo :call VimuxRunCommand("clojure")<CR>
map <Leader>lk :call VimuxClosePanes()<CR>
map <Leader>ll "vy :call VimuxRunCommand(@v . "\n", 0)<CR>
map <Leader>lyy 0v$"vy :call VimuxRunCommand(@v . "\n", 0)<CR>



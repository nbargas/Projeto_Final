" ~/.vimrc - Destaque semântico de comentários (FLUXO / TRANSF / ERRO)
syntax on
set number
set t_Co=256

augroup ComentariosSemanticos
  autocmd!
  autocmd Syntax * syntax match TagFluxo /\/\/.*\[FLUXO\].*/ containedin=ALL
  autocmd Syntax * syntax match TagTransf /\/\/.*\[TRANSF\].*/ containedin=ALL
  autocmd Syntax * syntax match TagErro /\/\/.*\[ERRO\].*/ containedin=ALL
  autocmd Syntax * syntax match TagFluxo /#.*\[FLUXO\].*/ containedin=ALL
  autocmd Syntax * syntax match TagTransf /#.*\[TRANSF\].*/ containedin=ALL
  autocmd Syntax * syntax match TagErro /#.*\[ERRO\].*/ containedin=ALL
  autocmd ColorScheme * call s:CoresTags()
augroup END

function! s:CoresTags()
  highlight TagFluxo  ctermfg=39  guifg=#00afff cterm=bold gui=bold
  highlight TagTransf ctermfg=46  guifg=#00ff00 cterm=bold gui=bold
  highlight TagErro   ctermfg=196 guifg=#ff0000 cterm=bold gui=bold
endfunction
call s:CoresTags()

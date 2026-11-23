-- Notas de rodapé no pé da página do PDF.
--
-- O Pandoc reúne as notas do HTML numa seção no fim do documento. O PDF sai
-- do WeasyPrint, que posiciona no pé da página qualquer elemento com
-- `float: footnote`. Este filtro troca cada nota por um span com a classe
-- `footnote`, no lugar da chamada; o pdf.css faz o resto (chamada, marcador
-- e área da nota). Só a conversão para o PDF usa o filtro: o EPUB mantém as
-- notas com link de ida e volta.

function Note(nota)
  local inlines = pandoc.utils.blocks_to_inlines(nota.content, { pandoc.Space() })
  return pandoc.Span(inlines, { class = "footnote" })
end

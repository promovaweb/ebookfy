# Revisar os arquivos de leitura

O PDF usa o kit A4 da Promovaweb com Inter e Manrope, sumário e paginação. A capa tipográfica do PDF reúne o símbolo de `files.logo`, a editora (`book.publisher`), o título, o subtítulo quando preenchido e a descrição. Ela mostra “Edição X.Y.Z” com `book.version` e “Gerado em” com `book.date`. Os nomes dos autores ficam fora dessa página.

A imagem de `files.cover` é a capa do EPUB e do MOBI. Se você omitir `files.logo`, o PDF reduz essa imagem inteira para o espaço do símbolo. O texto do EPUB se ajusta ao tamanho da tela. Para gerar MOBI, o Ebookfy cria primeiro um EPUB temporário e o converte com o Calibre. Você pode selecionar apenas MOBI na configuração.

Use ebookfy build --json em automações. Leia data.arquivos somente quando o processo sair com sucesso. O compilador prepara os formatos numa pasta temporária e começa a mover os resultados depois de terminar as conversões. Recompilar com o mesmo slug e versão substitui os arquivos daquela edição.

Qualquer aviso do Pandoc interrompe a compilação. A mensagem de falha de um conversor começa com o nome do programa, como `pandoc:`, `weasyprint:` ou `ebook-convert:`. Se uma imagem sumir, confira a grafia e as maiúsculas do caminho no capítulo. Abra o PDF e verifique quebras e rodapé. No EPUB, navegue pelo índice e teste uma fonte maior. Abra também o MOBI e confira se os acentos, a capa e as legendas sobreviveram à conversão.

## Escolher o formato da prova

| Formato | Programas chamados | O que conferir primeiro |
| --- | --- | --- |
| PDF | Pandoc e WeasyPrint | Tamanho A4, tipografia, quebras, largura de tabelas e rodapé. |
| EPUB | Pandoc | Capa na biblioteca, índice, ordem dos capítulos e leitura com fonte maior. |
| MOBI | Pandoc e Calibre | Conversão das imagens, acentos e navegação no leitor de destino. |

Para revisar texto ao longo da escrita, deixe apenas EPUB na lista de formatos. Ao preparar a entrega, restaure a lista acordada para a edição. A lista retornada por `build --json` contém os arquivos daquela execução. Exemplares de versões anteriores podem continuar na pasta de saída.

No **Caderno da oficina**, criado no capítulo 1 com a ficha do capítulo 2, a compilação com três formatos e versão `1.0.0` retorna a seguinte lista dentro de `data.arquivos`. Os caminhos se referem à raiz do livro, inclusive se o comando partiu de um capítulo.

```json
[
  "ebook/caderno-da-oficina-v1.0.0.pdf",
  "ebook/caderno-da-oficina-v1.0.0.epub",
  "ebook/caderno-da-oficina-v1.0.0.mobi"
]
```

## Conferir o exemplar que será entregue

Abra uma passagem com texto e uma passagem com imagem em cada formato. Siga o índice até ambas, confira o título e volte ao sumário. No PDF, procure uma tabela ou bloco de código perto de uma quebra de página. No EPUB, aumente a fonte e gire a tela. No MOBI, confira o mesmo trecho após a conversão.

Para conferir uma transferência, calcule o SHA-256 dos arquivos da edição e compare com a cópia baixada do destino. O comando abaixo usa os arquivos do exercício **Caderno da oficina** dos capítulos 1 a 3. Execute-o na raiz do livro em Linux.

```bash
sha256sum ebook/caderno-da-oficina-v1.0.0.{pdf,epub,mobi}
```

O compilador usa `book.date` como data interna dos formatos (`SOURCE_DATE_EPOCH`). Com as mesmas fontes e as mesmas versões dos conversores, PDF e EPUB saem idênticos a cada build. O MOBI muda, porque o Calibre grava o horário da conversão e um identificador próprio. Para verificar um download, compare o hash com o do arquivo conferido, não com um build novo.

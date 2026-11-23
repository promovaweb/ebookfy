# Organizar texto e imagens

No exercício **Caderno da oficina**, iniciado no capítulo 1 e configurado no capítulo 2, acrescente um segundo capítulo com uma figura provisória. Na raiz do livro, copie o ícone do primeiro capítulo.

```bash
mkdir -p capitulos/02-oficina/imagens
cp capitulos/01-primeiro-capitulo/imagens/livro.png capitulos/02-oficina/imagens/livro.png
```

Salve o texto abaixo em `capitulos/02-oficina/CHAPTER.md`.

```markdown
# Conferir o material da oficina

Abra o caderno na página marcada antes de distribuir os materiais.

![Símbolo de um livro aberto com marcador](imagens/livro.png)
```

Acrescente esta tabela ao fim de `ebook.toml`. Execute `ebookfy build`, abra o EPUB e escolha **Conferir o material da oficina** no índice para ver a figura.

```toml
[[chapters]]
file = "capitulos/02-oficina/CHAPTER.md"
```

Quando uma imagem ocupa sozinha um parágrafo, o texto entre colchetes serve como legenda visível e como texto alternativo para leitores de tela. Quando substituir a figura, descreva no texto alternativo o detalhe que ela ensina. Para uma fotografia de uma bancada, indique a posição dos objetos que o leitor precisa reconhecer. Registre a origem, a autoria da imagem e a permissão de distribuição no texto de créditos. Se mover a imagem para outra pasta, atualize a referência no Markdown e gere outra prova.

## Ligar capítulos e numerar notas

O Ebookfy compila o livro inteiro como um documento. Para levar o leitor a outro capítulo, use a âncora de um título. Por exemplo, `[Confira os materiais](#materiais)` leva ao título `## Materiais {#materiais}`. Um link para outro `CHAPTER.md` compila, mas fica quebrado na edição.

Dois títulos chamados **Exemplo** recebem os identificadores automáticos `exemplo` e `exemplo-1`, na ordem de leitura. Use identificadores explícitos e únicos para manter os links ao reorganizar capítulos. Nas notas de rodapé, use um prefixo por capítulo, como `[^cap02-fonte]`, tanto na chamada quanto na definição. Repetir o rótulo de uma nota em outro capítulo interrompe a compilação com `Duplicate note reference`.

## Preparar as páginas editoriais

O prefácio abre o livro. Depois vêm os capítulos na ordem de `[[chapters]]`, os créditos e a autoria. No prefácio, indique a tarefa que o leitor poderá executar e os materiais de partida. Na introdução, faça a primeira ação junto com ele. Se a introdução tiver uma página própria, dê a ela um `CHAPTER.md` e registre-a antes dos demais capítulos. Para o fechamento, retome o exemplo do livro e mostre o resultado que o leitor pode conferir.

A capa digital é um arquivo de imagem. Editar o título no TOML atualiza os metadados, mas as letras já desenhadas na imagem precisam de uma nova exportação da arte. O PDF compõe a página inicial a partir do título, da descrição e do símbolo configurado. Antes de distribuir, compare a primeira página do PDF, a miniatura do EPUB e a ficha mostrada pelo leitor.

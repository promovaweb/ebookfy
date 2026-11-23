# Organizar texto e imagens

Crie capitulos/02-oficina/CHAPTER.md e escreva um título na primeira linha. Salve o diagrama dessa oficina em capitulos/02-oficina/imagens/oficina.png. No texto, indique a imagem pelo caminho relativo à pasta do capítulo.

```markdown
# Preparar a oficina

![Disposição das mesas da oficina](imagens/oficina.png)
```

Acrescente a tabela abaixo ao fim do TOML. Mover a tabela altera a ordem das páginas. Mover a pasta exige atualizar o caminho.

```toml
[[chapters]]
file = "capitulos/02-oficina/CHAPTER.md"
```

No prefácio, apresente o público e o percurso. Reserve os créditos para contribuições, imagens e licenças. Na seção de autoria, registre o nome e a contribuição de cada autor. O compilador abre o prefácio antes do primeiro capítulo e fecha a edição com os créditos e a autoria.

## Acrescentar um segundo capítulo sem perder a figura

Na raiz de uma cópia do starter kit, crie a pasta do segundo capítulo. Para testar a composição antes de ter a ilustração definitiva, reutilize o ícone que já acompanha o exemplo.

```bash
mkdir -p capitulos/02-oficina/imagens
cp capitulos/01-primeiro-capitulo/imagens/livro.png capitulos/02-oficina/imagens/livro.png
```

Salve o texto abaixo em `capitulos/02-oficina/CHAPTER.md` e acrescente a tabela do capítulo ao TOML. Abra o EPUB e siga o item **Conferir o material da oficina** no índice. A imagem precisa estar na página do segundo capítulo, mesmo que os dois arquivos de imagem tenham o mesmo nome.

```markdown
# Conferir o material da oficina

Abra o caderno na página marcada antes de distribuir os materiais.

![Símbolo de um livro aberto com marcador](imagens/livro.png)
```

Quando substituir a figura, descreva no texto alternativo o detalhe que ela ensina. Para uma fotografia de uma bancada, indique a posição dos objetos que o leitor precisa reconhecer. Registre a origem, a autoria da imagem e a permissão de distribuição no texto de créditos. Se mover a imagem para outra pasta, atualize a referência no Markdown e gere outra prova.

## Preparar as páginas editoriais

No prefácio, indique a tarefa que o leitor poderá executar e os materiais de partida. Na introdução, faça a primeira ação junto com ele. Se a introdução tiver uma página própria, dê a ela um `CHAPTER.md` e registre-a antes dos demais capítulos. Para o fechamento, retome o exemplo do livro e mostre o resultado que o leitor pode conferir.

A capa digital é um arquivo de imagem. Editar o título no TOML atualiza os metadados, mas as letras já desenhadas na imagem precisam de uma nova exportação da arte. O PDF compõe a página inicial a partir do título, da descrição e do símbolo configurado. Antes de distribuir, compare a primeira página do PDF, a miniatura do EPUB e a ficha mostrada pelo leitor.

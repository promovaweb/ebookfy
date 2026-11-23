# Trazer um manuscrito de outro projeto

Os ebooks de projetos como o Termfy têm uma lista de leitura que seleciona as páginas do guia. Já os ebooks editoriais do Hub podem reunir a obra em ebook.md, com pesquisa, plano e checklist em pastas vizinhas. Antes de copiar os arquivos, abra a edição disponível e anote o primeiro e o último título de cada parte.

Para um guia de projeto, percorra reading-order.txt e leve cada página selecionada a uma pasta de capítulo. Para um manuscrito único, separe prefácio, capítulos, créditos e apresentação do autor. Transfira os metadados editoriais para ebook.toml. Mantenha a pesquisa e a checklist ao lado das fontes enquanto revisa a adaptação.

Ao transportar figuras de dois capítulos, preserve cada arquivo perto de seu texto. Isso permite que capítulos diferentes tenham uma imagem chamada exemplo.png. Confira cada figura pelo conteúdo depois de compilar. Compare o sumário, os comandos e a sequência com o guia anterior.

## Mapear o material antes de mover os arquivos

| Origem | Destino no projeto do livro | Conferência |
| --- | --- | --- |
| Frontmatter do manuscrito | Campos correspondentes de `[book]` e `[files]` | Conferir título, idioma, autoria e capa com a edição anterior. |
| Ordem do guia do projeto | Uma tabela `[[chapters]]` por capítulo | Comparar o primeiro e o último item com o sumário publicado. |
| Texto de capítulo | Uma pasta com `CHAPTER.md` | Abrir o capítulo pelo índice no EPUB. |
| Fotografias, diagramas e capturas | Pasta de imagens do capítulo que os utiliza | Conferir o conteúdo da figura e a legenda. |
| Pesquisa, pautas e notas de revisão | Pastas de trabalho fora da lista de capítulos | Conferir o sumário e procurar no livro uma nota interna conhecida. |

Faça primeiro uma prova com dois capítulos, de preferência um capítulo de texto e outro com figuras ou comandos. A amostra revela problemas de títulos, caminhos e acentos antes de transferir o restante da obra. Mantenha os originais disponíveis até terminar a comparação.

Ao dividir um manuscrito longo, ajuste os níveis dos títulos. O título principal do novo arquivo passa a nível 1, as seções internas passam a nível 2 e as subseções a nível 3. Preserve blocos cercados por crases ou tils, inclusive as linhas iniciadas com `#` dentro de exemplos de shell. Elas fazem parte do exemplo.

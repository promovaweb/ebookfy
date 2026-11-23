# Usar a interface de terminal

Abra um terminal na pasta do livro ou dentro de um capítulo e execute `ebookfy`. Para abrir diretamente o menu do livro quando sua preferência inicial aponta para outra aba, use `ebookfy tui --tab overview`. O aplicativo lê o TOML do projeto e os títulos dos arquivos de capítulo.

![Menu do livro ao lado do sumário de Meu primeiro ebook](imagens/tui-livro.png)

Use as setas para cima e para baixo para escolher uma opção. O marcador `>` indica a seleção. Pressione Enter ou clique no nome para abrir. Em terminais com 80 colunas ou mais, o sumário aparece ao lado do menu. Entre 60 e 79 colunas, abra **Capítulos** para consultar a mesma lista. A interface precisa de pelo menos 60 colunas e 16 linhas. Se faltar largura ou altura, ela mostra **Terminal pequeno**.

| Opção | Tecla | O que você encontra |
| --- | --- | --- |
| Ficha editorial | `f` | Autoria, editora, edição, data, idioma, identificador e descrição do livro aberto. |
| Capítulos | `c` | Títulos na ordem de `[[chapters]]` e caminho de cada arquivo Markdown para edição. |
| Arquivos de saída | `a` | Formatos da edição e caminho de cada arquivo. **A gerar** indica que o arquivo ainda falta. **Disponível** indica que ele existe na pasta configurada. |
| Guia do Ebookfy | `g` | Documentação embutida e índice de assuntos na aba Docs. |

Nas três consultas do livro, pressione Esc para voltar ao menu. Para verificar uma exportação, pressione `a`, execute `ebookfy build` em outro terminal e pressione `r`. Um arquivo disponível pode pertencer a uma compilação anterior. Gere a edição novamente depois de editar o manuscrito.

## Conferir uma alteração durante a escrita

Mantenha a TUI aberta e edite o título de um capítulo em outro terminal ou no editor. Salve o arquivo, volte à aba Livro e pressione `r`. Confira o novo título na mesma posição da lista. Depois, mova a tabela desse capítulo no TOML e salve. A aba acompanha mudanças na configuração e permite conferir a nova ordem antes de compilar.

| Ação | Atalho |
| --- | --- |
| Abrir Livro, Preferências, Credenciais, Docs ou Sobre | Teclas de `1` a `5`, conforme a barra superior |
| Avançar ou voltar uma aba | Setas direita e esquerda ou `]` e `[` |
| Alternar o foco entre painéis | `Tab` e `Shift+Tab` |
| Abrir a lista de comandos da interface | `Ctrl+K` ou `:` |
| Ver a ajuda de teclado e mouse | `?` |
| Fechar um diálogo | `Esc` |
| Sair da TUI | `q` na tela principal |

## Consultar o manual sem sair do terminal

Pressione `4` para abrir **Docs** ou execute `ebookfy tui --tab docs` diretamente no terminal. Use `t` para escolher um tópico. As setas para cima e para baixo percorrem o texto. `PageUp` e `PageDown` percorrem trechos maiores. Consulte o tópico de configuração para ajustar preferências pessoais ou a referência de comandos para conferir argumentos e opções.

![Aba Docs com o tópico ebook selecionado e o guia da primeira edição aberto ao lado do índice](imagens/tui-docs.png)

Em um script, use `ebookfy info --json` para ler a ficha sem abrir a TUI. A opção é apropriada para uma etapa de integração contínua que precisa extrair a lista de capítulos ou os formatos antes do build.

O tópico `ebook` reúne os guias de instalação, configuração, capítulos, migração, exportação e skills editoriais. Ele acompanha o aplicativo instalado. Você pode consultá-lo mesmo que apenas o manuscrito e o CLI estejam disponíveis na máquina.

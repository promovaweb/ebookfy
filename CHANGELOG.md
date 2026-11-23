# Changelog

## 0.6.0

- O repositório passa a ser público, sob a GNU AGPL 3.0 (`AGPL-3.0-only`), com `LICENSE` também no pacote npm. Versões anteriores continuam sob a licença com que saíram. O README segue o padrão dos projetos open source da Promovaweb, com links absolutos para a página do npm.
- Erros no `ebook.toml` saem em português, uma linha por campo, com exit code 3 (`CONFIG`): chave desconhecida, campo ausente, formato de versão, data ou slug, lista vazia e formato de saída inválido. Em `--json`, `error.details.problemas` traz `campo`, `mensagem` e `codigo`. Erro de sintaxe TOML e arquivo declarado que não existe também viram `CONFIG`, com mensagem direta.
- O `build` recusa imagem com endereço remoto ou com caminho fora da pasta do livro, antes de chamar o Pandoc, e lista arquivo, linha e imagem. Imagens em blocos de código e `data:` continuam aceitas.
- Notas de rodapé ficam no pé da página do PDF, no lugar da seção única depois da apresentação de autoria. O EPUB mantém a nota com link de ida e volta.
- O build usa `book.date` como `SOURCE_DATE_EPOCH`: com as mesmas fontes e conversores, PDF e EPUB saem idênticos a cada build. O MOBI ainda muda, porque o Calibre grava horários próprios.
- `ebookfy doctor` mostra o `epubcheck`, validador opcional do EPUB.
- `npm run capturas` gera as figuras da TUI do manual e do livro de exemplo a partir das telas reais, com tmux, xterm.js e Chromium. O capítulo 1 do exemplo ganhou a captura da aba Livro.
- O `init` usa o starter kit 0.4.0, agora público e sob licença MIT. Skills, manual e documentação descrevem as novas mensagens, a recusa de imagens, as notas no pé da página e o build reproduzível.

## 0.5.1

- O livro de exemplo **Meu primeiro ebook** virou um guia completo de 22 páginas, em sete capítulos: preparar a edição, planejar, escrever, imagens e capa, textos editoriais, compilar e conferir, revisar e distribuir. Cada capítulo usa no próprio texto o recurso que explica, e as figuras são a capa e o sumário da própria edição.
- O PDF, o EPUB e o MOBI do exemplo ficam em `ebook/`, com link no README, para ver o resultado antes de instalar.
- Listas de tarefas (`- [ ]`) saem no PDF com a caixa na mesma linha do texto. Antes, o WeasyPrint desenhava cada caixa numa linha separada.
- A capa digital do manual mostra a edição corrente.
- O `init` usa o starter kit 0.3.1.

## 0.5.0

- As 15 skills foram reescritas. Cada uma traz quando usar, o procedimento passo a passo, as regras do compilador que afetam a etapa, uma tabela de problemas frequentes, a entrega e uma checklist ampliada. São 26 referências com modelos preenchidos, todas conferidas num build real: briefing, ficha de apuração, roteiro de capítulo, Markdown aceito, capturas e legendas, especificações e provas de capa, registro de atribuição, passadas de revisão com comandos, prova dos formatos, diagnóstico do build, conferência da entrega e mapa de migração.
- As etapas combinam entre si pelos registros de `notas/`, fora da edição. A etapa 13 grava `notas/build.json`, e a 14 distribui exatamente os exemplares conferidos.
- O livro de exemplo ganhou três capítulos que mostram, em uso, figura com legenda, tabela, código, nota de rodapé, links entre capítulos e a conferência da edição.
- `ebookfy doctor` mostra a versão do Pandoc, do WeasyPrint e do `ebook-convert`, e avisa quais formatos ficam indisponíveis quando falta algum.
- O rodapé do PDF mostra o título do livro. Antes, a quebra automática de linha do Pandoc invalidava a regra, e o rodapé mostrava "Documento".
- Os blocos de código ganharam realce de sintaxe no PDF.
- Títulos com identificador explícito (`# Título {#id}`) aparecem sem o bloco de atributos no `info` e na TUI.
- O manual explica a capa tipográfica do PDF, os links entre capítulos, as notas de rodapé com prefixo, os avisos do Pandoc que interrompem o build, o frontmatter ignorado e as notas de trabalho. Mensagens e saídas do CLI citadas no manual foram corrigidas.
- O `init` usa o starter kit 0.3.0. A pasta `manual/ebook/` guarda só a edição atual; as anteriores ficam nas GitHub Releases.

## 0.4.1

- Revisa a explicação das preferências pessoais do terminal e atualiza os três formatos do manual.

## 0.4.0

- As 15 skills editoriais ganharam roteiros de execução, referências portáteis com exemplos e checklists de entrega. O init usa o starter kit 0.2.0 com essas referências instaladas.
- Exemplo e manual usam o mesmo arranjo de capítulos, materiais editoriais e saídas. O guia da ficha explica os caminhos e as configurações pessoais do CLI.

## 0.3.1

- A raiz abre o livro ilustrado **Meu primeiro ebook**, o mesmo exemplo entregue pelo starter kit. O manual completo tem projeto próprio em `manual/` e pode ser compilado com `npm run manual`.

## 0.3.0

- A aba Livro reúne ficha, capítulos, arquivos e guia em um menu colorido com mouse, setas e atalhos. A interface adapta o sumário à largura do terminal.
- A consulta de arquivos mostra os caminhos e a presença dos formatos configurados. O manual inclui capturas da interface e instruções de navegação.

## 0.2.0

- Adiciona `ebookfy init` para iniciar um livro em um repositório vazio a partir do starter kit privado, com o TOML, o capítulo ilustrado e as 15 skills.

## 0.1.1

- Manual ampliado com ficha TOML completa, capítulo ilustrado, migração, diagnóstico e captura da TUI.
- Guia de produção disponível no terminal e no MCP pelo tópico `ebook`.
- Consulta e compilação a partir de subpastas e identificação de títulos Markdown fora dos blocos de código.

## 0.1.0 · 2026-11-23

- Primeira edição do CLI, TUI e servidor MCP sobre Termfy.
- Configuração editorial em TOML, capítulos em pastas e exportação PDF, EPUB e MOBI.
- Quinze skills numeradas, identidade visual e manual completo nos três formatos.

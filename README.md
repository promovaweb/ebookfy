<p align="center"><img src="brand/logo/icon.png" width="80" alt="Símbolo do Ebookfy"></p>

# Ebookfy

O Ebookfy organiza um livro em capítulos Markdown e gera PDF, EPUB e MOBI a partir do mesmo manuscrito. Na interface do terminal, você vê a ficha editorial e a sequência de leitura da edição aberta.

## Instalação

Com Node.js 22 ou superior, instale o CLI pelo npm. O pacote inclui o runtime Bun. Para compilar EPUB, instale o Pandoc. Para PDF, acrescente o WeasyPrint. Para MOBI, instale também o Calibre com o comando `ebook-convert` disponível no terminal.

```bash
npm install -g @promovaweb/ebookfy
ebookfy --version
```

## Primeiro livro

Use o template privado com uma conta que tenha acesso à organização. A primeira execução pode usar o livro de exemplo como está.

```bash
gh repo clone promovaweb/ebookfy-starter-kit meu-livro
cd meu-livro
ebookfy info
ebookfy
ebookfy build
```

Edite `ebook.toml` na raiz para definir autoria, capa, ordem dos capítulos, pasta de saída e formatos. Cada capítulo tem seu próprio `CHAPTER.md` e pode guardar figuras na pasta `imagens/` ao lado do texto. O CLI imprime os caminhos dos arquivos gerados.

## Skills e documentação

O starter kit já traz as skills numeradas. Para instalá-las em outro projeto, execute o comando na pasta do livro com uma conta Git autorizada.

```bash
npx skills add promovaweb/ebookfy -a universal -a claude-code -a codex -a opencode -y
```

Consulte o [manual editável](manual/01-primeira-edicao/CHAPTER.md), a [documentação do terminal](docs/README.md) ou baixe o [PDF](ebook/manual-ebookfy-v0.1.0.pdf), o [EPUB](ebook/manual-ebookfy-v0.1.0.epub) e o [MOBI](ebook/manual-ebookfy-v0.1.0.mobi). Em automações, use `ebookfy info --json`. A referência embutida está disponível com `ebookfy --skill`.

## Feito com

O aplicativo deriva do [Termfy Starter Kit](https://github.com/promovaweb/termfy-starter-kit) e usa o [Termfy](https://github.com/promovaweb/termfy) para oferecer CLI, TUI e MCP no mesmo comando.

## Comunidade e contribuição

Acompanhe as [versões](CHANGELOG.md), consulte o [guia de contribuição](CONTRIBUTING.md) ou participe do [Discord da Promovaweb](https://promovaweb.com/discord). Conheça os [planos da Promovaweb](https://promovaweb.com/planos).

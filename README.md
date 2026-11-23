<p align="center"><img src="brand/logo/icon.png" width="80" alt="Símbolo do Ebookfy"></p>

# Ebookfy

O Ebookfy organiza um livro em capítulos Markdown e gera PDF, EPUB e MOBI a partir do mesmo manuscrito. Na interface do terminal, você vê a ficha editorial e a sequência de leitura da edição aberta.

## Instalação

Com Node.js 22 ou superior, instale o CLI pelo npm. O pacote inclui o runtime Bun. Para compilar EPUB, instale o Pandoc. Para PDF, acrescente o WeasyPrint. Para MOBI, instale também o Calibre com o comando `ebook-convert` disponível no terminal. O `ebookfy doctor` mostra a versão de cada conversor e avisa quais formatos ficam indisponíveis quando falta algum.

```bash
npm install -g @promovaweb/ebookfy
ebookfy --version
ebookfy doctor
```

## Primeiro livro

Em um repositório vazio, execute `ebookfy init`. Para começar em uma pasta nova, siga o exemplo abaixo. O Git precisa ter acesso ao [starter kit privado](https://github.com/promovaweb/ebookfy-starter-kit). O comando copia a ficha, o capítulo ilustrado, os materiais editoriais e as skills já instaladas.

```bash
git init meu-livro
cd meu-livro
ebookfy init
ebookfy info
ebookfy
ebookfy build
```

Edite `ebook.toml` na raiz para definir autoria, capa, ordem dos capítulos, pasta de saída e formatos. Cada capítulo tem seu próprio `CHAPTER.md` e pode guardar figuras na pasta `imagens/` ao lado do texto. O CLI imprime os caminhos dos arquivos gerados.

Na aba **Livro**, escolha uma opção com as setas e abra com Enter ou com um clique. Use `f` para a ficha, `c` para capítulos, `a` para os arquivos gerados e `g` para o guia.

![Menu da TUI com as quatro opções e o sumário do exemplo](manual/capitulos/07-terminal/imagens/tui-livro.png)

No repositório do framework, o [livro de exemplo](ebook.toml) é **Meu primeiro ebook**, o mesmo que o `ebookfy init` instala. É um guia curto, em sete capítulos, que usa no próprio texto cada recurso que explica: capa, sumário, prefácio, figuras com legenda, tabelas, código com realce, notas de rodapé, links entre capítulos, créditos e autoria. Para ver o resultado antes de instalar, abra o [PDF](ebook/primeiro-ebook-v0.1.0.pdf), o [EPUB](ebook/primeiro-ebook-v0.1.0.epub) ou o [MOBI](ebook/primeiro-ebook-v0.1.0.mobi) gerados pelo Ebookfy. Depois, abra o [primeiro capítulo](capitulos/01-primeiro-capitulo/CHAPTER.md), edite um parágrafo e execute `ebookfy build` na raiz para ler sua edição.

## Onde editar

| Material | Local |
| --- | --- |
| Ficha da edição e formatos | `ebook.toml` na raiz do livro aberto |
| Texto e figuras de cada capítulo | `capitulos/<pasta>/CHAPTER.md` e `imagens/` ao lado |
| Capa, prefácio, créditos e autoria | Arquivos apontados por `[files]`, normalmente em `editorial/` |
| Briefing, fontes, revisão e outros registros de trabalho | [`notas/`](notas/README.md), fora da edição |
| Exemplares exportados | Pasta de `output.directory`, por padrão `ebook/` |
| Manual do framework | Projeto independente em [manual/](manual/ebook.toml), com a mesma estrutura |
| Tema e preferências do terminal | Perfil pessoal em `~/.ebookfy/`, consultado com `ebookfy config list` |

## Skills e documentação

As [15 skills numeradas](skills/) cobrem o livro da organização à distribuição. Cada uma traz quando usar, o procedimento, as regras do compilador que afetam a etapa, uma tabela de problemas frequentes, uma checklist da entrega e referências com modelos preenchidos. As etapas combinam entre si pelos registros de `notas/`. O starter kit já inclui a biblioteca instalada. Para instalá-las em outro projeto, execute o comando na pasta do livro com acesso Git ao framework.

```bash
npx skills add promovaweb/ebookfy -a universal -a claude-code -a codex -a opencode -y
```

Consulte o [manual editável](manual/capitulos/01-primeira-edicao/CHAPTER.md), a [documentação completa](docs/README.md) ou baixe o [PDF](manual/ebook/manual-ebookfy-v0.5.1.pdf), o [EPUB](manual/ebook/manual-ebookfy-v0.5.1.epub) e o [MOBI](manual/ebook/manual-ebookfy-v0.5.1.mobi). Em automações, use `ebookfy info --json`. A referência embutida está disponível com `ebookfy --skill`.

## Feito com

O aplicativo deriva do [Termfy Starter Kit](https://github.com/promovaweb/termfy-starter-kit) e usa o [Termfy](https://github.com/promovaweb/termfy) para oferecer CLI, TUI e MCP no mesmo comando.

## Comunidade e contribuição

Acompanhe as [versões](CHANGELOG.md), consulte o [guia de contribuição](CONTRIBUTING.md) ou participe do [Discord da Promovaweb](https://promovaweb.com/discord). Conheça os [planos da Promovaweb](https://promovaweb.com/planos).

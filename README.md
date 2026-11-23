<p align="center">
  <a href="https://github.com/promovaweb/ebookfy">
    <img alt="Ebookfy" src="https://raw.githubusercontent.com/promovaweb/ebookfy/main/brand/logo/icon.png" width="112" height="112">
  </a>
</p>

<h1 align="center">Ebookfy</h1>

<p align="center">
  Escreva o livro em capítulos Markdown e gere PDF, EPUB e MOBI com um comando, com skills que conduzem o seu agente da ideia à entrega.
</p>

<p align="center">Um projeto da <a href="https://promovaweb.com">Promovaweb</a></p>

<p align="center">
  <a href="https://github.com/promovaweb/ebookfy/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/promovaweb/ebookfy"></a>
  <a href="https://www.npmjs.com/package/@promovaweb/ebookfy"><img alt="npm" src="https://img.shields.io/npm/v/@promovaweb/ebookfy"></a>
  <a href="https://github.com/promovaweb/ebookfy/blob/main/LICENSE"><img alt="Licença" src="https://img.shields.io/github/license/promovaweb/ebookfy"></a>
</p>

<p align="center">
  <a href="https://promovaweb.com/discord"><img alt="Discord: obter ajuda e conversar com a Comunidade" src="https://img.shields.io/badge/Discord-Obter%20ajuda%20e%20conversar%20com%20a%20Comunidade-5865F2?style=for-the-badge&logo=discord&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://promovaweb.com/ferramentas/">Ferramentas</a> ·
  <a href="https://promovaweb.com/docs/">Documentação</a> ·
  <a href="https://promovaweb.com/harness/">Harness</a> ·
  <a href="https://promovaweb.com/discord">Discord</a> ·
  <a href="https://promovaweb.com/planos?utm_source=github&utm_medium=readme&utm_campaign=ebookfy">Planos da Promovaweb</a> ·
  <a href="https://github.com/promovaweb/ebookfy/blob/main/CHANGELOG.md">Changelog</a>
</p>

## O que é

O Ebookfy organiza um livro em pastas, uma por capítulo, e gera PDF, EPUB e MOBI a partir do mesmo texto. A ficha `ebook.toml` guarda título, autoria, versão, ordem dos capítulos e formatos. Quinze skills numeradas guiam o seu agente de código em cada etapa: organizar, pesquisar, planejar, escrever, ilustrar, montar a capa, revisar, exportar e distribuir.

| Modo | Para quê |
| --- | --- |
| CLI | `ebookfy init`, `info`, `build` e `doctor`, com saída em texto ou `--json` |
| TUI | `ebookfy` sem argumentos abre a ficha, o sumário, os arquivos gerados e o guia |
| MCP | `ebookfy mcp` deixa agentes consultarem a ficha e o diagnóstico |
| Skills | `ebookfy-01-organizar` a `ebookfy-15-migrar`, para Claude Code, Codex e OpenCode |

Para ver o resultado antes de instalar, abra o livro de exemplo compilado pelo Ebookfy: [PDF](https://github.com/promovaweb/ebookfy/blob/main/ebook/primeiro-ebook-v0.1.0.pdf), [EPUB](https://github.com/promovaweb/ebookfy/blob/main/ebook/primeiro-ebook-v0.1.0.epub) ou [MOBI](https://github.com/promovaweb/ebookfy/blob/main/ebook/primeiro-ebook-v0.1.0.mobi). **Meu primeiro ebook** é um guia curto, em sete capítulos, que usa no próprio texto cada recurso que explica: capa, sumário, prefácio, figuras com legenda, tabelas, código com realce, notas de rodapé, links entre capítulos, créditos e autoria.

## Instalação

Com [Node.js](https://github.com/nodejs/node) 22 ou superior, instale o CLI pelo npm. O pacote inclui o runtime [Bun](https://github.com/oven-sh/bun).

```bash
npm install -g @promovaweb/ebookfy
ebookfy --version
ebookfy doctor
```

Os formatos dependem de conversores instalados no sistema:

| Formato | Instale |
| --- | --- |
| EPUB | [Pandoc](https://github.com/jgm/pandoc) |
| PDF | Pandoc e [WeasyPrint](https://github.com/Kozea/WeasyPrint) |
| MOBI | Pandoc e o [Calibre](https://github.com/kovidgoyal/calibre), com o comando `ebook-convert` |

O `ebookfy doctor` mostra a versão de cada conversor e avisa quais formatos ficam indisponíveis quando falta algum. Para atualizar, rode `npm install -g @promovaweb/ebookfy@latest`.

## Primeiros passos

Num repositório Git vazio, `ebookfy init` copia o [Ebookfy Starter Kit](https://github.com/promovaweb/ebookfy-starter-kit): a ficha, o livro de exemplo, os textos editoriais e as skills instaladas.

```bash
git init meu-livro
cd meu-livro
ebookfy init
ebookfy info      # ficha e sumário
ebookfy           # interface do terminal
ebookfy build     # PDF, EPUB e MOBI em ebook/
```

Troque o título e a autoria no `ebook.toml`, edite um capítulo e compile de novo. O CLI imprime os caminhos dos arquivos gerados.

![Aba Livro da interface do terminal, com o menu à esquerda e o sumário do livro de exemplo](https://raw.githubusercontent.com/promovaweb/ebookfy/main/manual/capitulos/07-terminal/imagens/tui-livro.png)

Na aba **Livro**, escolha uma opção com as setas e abra com Enter ou com um clique. Use `f` para a ficha, `c` para capítulos, `a` para os arquivos gerados e `g` para o guia.

## Uso

| Para alterar | Abra |
| --- | --- |
| Título, autoria, versão, formatos e ordem dos capítulos | `ebook.toml` na raiz do livro |
| Texto e figuras de um capítulo | `capitulos/<pasta>/CHAPTER.md` e a pasta `imagens/` ao lado |
| Capa, prefácio, créditos e autoria | Os arquivos de `[files]`, normalmente em `editorial/` |
| Briefing, fontes, revisão e registros de trabalho | `notas/`, fora da edição |
| Arquivos gerados | A pasta de `output.directory`, por padrão `ebook/` |
| Tema e preferências do terminal | `~/.ebookfy/`, consultado com `ebookfy config list` |

Um capítulo novo é uma pasta com `CHAPTER.md` e uma tabela no `ebook.toml`, na posição de leitura:

```toml
[[chapters]]
file = "capitulos/08-novo-capitulo/CHAPTER.md"
```

Antes de converter, o `build` confere a ficha e as imagens. Um erro no `ebook.toml` sai com uma linha por campo, como ``book.date está em formato inválido: use AAAA-MM-DD``. Imagem com endereço remoto ou fora da pasta do livro é recusada com o arquivo e a linha. Dois builds das mesmas fontes geram PDF e EPUB idênticos, porque o compilador usa `book.date` como data interna.

## Uso com agentes

As skills numeradas cobrem o livro da organização à distribuição. Cada uma traz quando usar, o procedimento, as regras do compilador que afetam a etapa, os problemas frequentes, uma checklist e modelos preenchidos. O starter kit já vem com elas. Para instalar em outro projeto, use o CLI [skills](https://github.com/vercel-labs/skills):

```bash
npx skills add promovaweb/ebookfy -a universal -a claude-code -a codex -a opencode -y
```

Comece pela `ebookfy-01-organizar`. Para trazer um livro de outra ferramenta, use a `ebookfy-15-migrar`.

O servidor MCP funciona em modo de leitura: consulta a ficha, o diagnóstico, a documentação embutida e as preferências, sem compilar nem mostrar segredos.

```json
{
  "mcpServers": {
    "ebookfy": { "command": "ebookfy", "args": ["mcp"] }
  }
}
```

No [Claude Code](https://github.com/anthropics/claude-code): `claude mcp add ebookfy -- ebookfy mcp`.

## Saída para scripts

Com `--json`, todo comando devolve um envelope com `ok`, `command` e `data`, ou `error` em caso de falha:

```json
{ "ok": true, "command": "ebookfy build", "data": { "arquivos": ["ebook/meu-livro-v0.1.0.pdf"] } }
```

```json
{
  "ok": false,
  "command": "ebookfy info",
  "error": {
    "code": 3,
    "name": "CONFIG",
    "message": "A ficha ebook.toml tem 1 problema:\n- Falta `files.cover`: informe um texto entre aspas.",
    "details": { "problemas": [{ "campo": "files.cover", "mensagem": "Falta `files.cover`: informe um texto entre aspas.", "codigo": "invalid_type" }] }
  }
}
```

| Code | Nome | Quando |
| --- | --- | --- |
| 0 | `SUCCESS` | operação concluída |
| 1 | `GENERIC_ERROR` | falha inesperada, inclusive de um conversor |
| 2 | `USAGE` | arguments, options ou subcommand inválidos |
| 3 | `CONFIG` | `ebook.toml` ou preferências inválidos, arquivo declarado ausente ou imagem recusada |
| 6 | `NOT_FOUND` | nenhum `ebook.toml` encontrado a partir da pasta atual |
| 8 | `NO_TTY` | a TUI exige um terminal interativo |

A tabela completa está em `ebookfy --skill exit-codes`.

## Arquivos e segurança

O livro mora no seu repositório. O Ebookfy grava apenas os arquivos gerados na pasta de saída, depois que todas as conversões terminam. As preferências do terminal ficam em `~/.ebookfy/`, com a pasta em modo `0700`. O `ebookfy doctor` confere o runtime, o terminal, essa pasta, os conversores e o validador opcional `epubcheck`, sem criar arquivos.

## Documentação

- [Manual](https://github.com/promovaweb/ebookfy/blob/main/manual/capitulos/01-primeira-edicao/CHAPTER.md), também em [PDF](https://github.com/promovaweb/ebookfy/blob/main/manual/ebook/manual-ebookfy-v0.6.0.pdf), [EPUB](https://github.com/promovaweb/ebookfy/blob/main/manual/ebook/manual-ebookfy-v0.6.0.epub) e [MOBI](https://github.com/promovaweb/ebookfy/blob/main/manual/ebook/manual-ebookfy-v0.6.0.mobi).
- [Referência do CLI, da configuração e do MCP](https://github.com/promovaweb/ebookfy/blob/main/docs/README.md).
- Ajuda embutida: `ebookfy --help` e `ebookfy --skill`.

## Feito com

| Projeto | Para quê |
| --- | --- |
| [Termfy](https://github.com/promovaweb/termfy) | framework de CLI, TUI e MCP da Promovaweb |
| [Termfy Starter Kit](https://github.com/promovaweb/termfy-starter-kit) | base do executável |
| [Bun](https://github.com/oven-sh/bun) | runtime incluído no pacote |
| [Pandoc](https://github.com/jgm/pandoc) | conversão do Markdown para HTML e EPUB |
| [WeasyPrint](https://github.com/Kozea/WeasyPrint) | PDF a partir do HTML |
| [Calibre](https://github.com/kovidgoyal/calibre) | MOBI a partir do EPUB |
| [skills](https://github.com/vercel-labs/skills) | instalação das skills nos agentes |

## Comunidade e suporte

- **Discord:** [obter ajuda e conversar com a Comunidade](https://promovaweb.com/discord).
- **Bugs e pedidos:** abra uma [issue](https://github.com/promovaweb/ebookfy/issues) com a versão, o sistema operacional e o passo a passo para reproduzir.
- **Novidades:** acompanhe o [CHANGELOG](https://github.com/promovaweb/ebookfy/blob/main/CHANGELOG.md) e as [releases](https://github.com/promovaweb/ebookfy/releases).

## Contribuir

Leia o [guia de contribuição](https://github.com/promovaweb/ebookfy/blob/main/CONTRIBUTING.md) para preparar o ambiente, validar e manter as skills, o manual e o livro de exemplo.

## Promovaweb

O Ebookfy é mantido pela [Promovaweb](https://promovaweb.com), comunidade de co-working digital onde profissionais aprendem a construir, automatizar e gerir negócios de tecnologia e IA com aulas ao vivo, Co-works e revisão de projetos reais.

Quer usar o Ebookfy em projetos de verdade, com acompanhamento? Conheça os [planos da Promovaweb](https://promovaweb.com/planos?utm_source=github&utm_medium=readme&utm_campaign=ebookfy).

## Licença

Distribuído sob a [GNU AGPL 3.0](https://github.com/promovaweb/ebookfy/blob/main/LICENSE). A licença não concede o uso do nome e do logo do Ebookfy nem da marca Promovaweb (AGPL 3.0, seção 7, item e). As fontes Inter e Manrope do kit de impressão seguem sob a SIL Open Font License, com as licenças junto aos arquivos.

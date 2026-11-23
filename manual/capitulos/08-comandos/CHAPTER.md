# Consultar os comandos e a saída JSON

## Convenções

- `ebookfy <command> [subcommand] [arguments] [options]`.
- Options aceitam `--key value` e `--key=value`. Não há agrupamento de flags
  curtas (`-abc`).
- `--` encerra a leitura de options; o que vem depois é argument.
- Options globais valem em qualquer posição, antes ou depois do command.
- Sem argumentos, em terminal interativo, o binário abre a TUI. Sem TTY,
  imprime o help e sai com exit code 2.
- Toda saída de dados vai para stdout. Avisos, progresso e erros em modo
  texto vão para stderr.
- Nomes de commands, subcommands, options, arguments, keys e campos de saída
  seguem as convenções do Termfy.

## Options globais

| Option | Efeito |
| --- | --- |
| `-h`, `--help` | Help do command atual. Exit code 0. |
| `-V`, `--version` | Imprime `ebookfy <version>`. Exit code 0. |
| `--json` | Saída em JSON com envelope estável. Erros também saem em JSON, em stdout. |
| `--skill [topic]` | Documentação embutida. Topics: `ebook`, `cli`, `tui`, `mcp`, `config`, `exit-codes`, `reference`. |
| `--opencli` | Descrição OpenCLI 0.1 da árvore de commands em JSON. |
| `--no-color` | Desliga cores ANSI. `NO_COLOR=1` tem o mesmo efeito. |

## Saída em texto e em JSON

Texto é o padrão quando `output.format` em settings.json é `text`. Com
`--json`, ou com `output.format = json`, a saída segue este envelope:

```json
{
  "ok": true,
  "command": "ebookfy config get",
  "data": {
    "key": "tui.theme",
    "value": "terminal"
  }
}
```

Em erro:

```json
{
  "ok": false,
  "command": "ebookfy credentials get",
  "error": {
    "code": 4,
    "name": "CREDENTIALS",
    "message": "Credential \"x\" not found. Save it with: ebookfy credentials set x",
    "details": {
      "name": "x"
    }
  }
}
```

O exit code do processo acompanha `error.code`. Um agente deve ler
os dois: o envelope para a mensagem, o code para a classe da falha.

## Comandos do terminal

| Command | Função |
| --- | --- |
| `tui [--tab <tab>]` | Abre a TUI. Exige TTY. |
| `about` | Version, executable, runtime, platform e credits. |
| `config list\|get\|set\|unset\|path\|schema` | Preferências em settings.json. |
| `credentials set\|get\|list\|remove\|status\|clear\|rotate-key` | Cofre cifrado em credentials.json. |
| `mcp [--list]` | Servidor MCP via stdio, ou listagem do que ele registra. |
| `skill [topic]` | Mesmo efeito de `--skill`. |
| `doctor` | Confere runtime, TTY, pasta, settings, chave, cofre e conversores. |
| `completion <shell>` | Gera script para `bash`, `zsh` ou `fish`. |

## Diagnóstico e completion

`ebookfy doctor` confere Bun 1.4.4 ou superior, TTY de stdin/stdout,
pasta de dados com 0700, leitura de settings.json, origem da master key,
decifragem do cofre, versão e plataforma. Cada linha usa ✓, ! ou ✗.
Em JSON, `data` contém `{ checks, ok }`; cada check tem `name`, `status`
e `detail`. Ausência de TTY ou de arquivos ainda não criados gera `warn`.
Uma verificação com `fail` produz exit code 3; as demais retornam 0.
Para cada conversor encontrado no PATH, o comando mostra a primeira linha de
`--version`. A ausência de `pandoc` impede todas as exportações. Sem
`weasyprint`, o PDF fica indisponível. Sem `ebook-convert` (Calibre), o MOBI
fica indisponível. Cada ausência gera um aviso (`warn`). Dentro de um livro,
o aviso indica quais formatos de `output.formats` dependem do conversor.
O diagnóstico não cria arquivos nem mostra segredos.

`ebookfy completion <shell>` imprime o script em stdout. O argument `shell`
aceita `bash`, `zsh` ou `fish`; subcommands, options locais e globais e valores
de enum vêm do registry. Com `--json`, `data` contém `{ shell, script }`.
O script Zsh usa `compdef` e `compadd`, sem `bashcompinit`.
Instale na sessão atual ou acrescente a linha ao arquivo de inicialização:

```bash
eval "$(ebookfy completion bash)"
eval "$(ebookfy completion zsh)"
# fish
ebookfy completion fish | source
```

`ebookfy --skill reference` retorna somente a referência gerada, com
commands, arguments, options e exit codes. `skill reference` tem o mesmo
resultado, sem os capítulos da documentação.

## Comandos do livro

Execute `ebookfy info` para consultar a ficha na pasta atual. Com `--json`, leia `data.chapters` para a sequência e `data.output` para o destino e os formatos. Execute `ebookfy build` para gerar a edição e `ebookfy build --json` para obter os caminhos em `data.arquivos`.

## Ler o resultado em uma automação

O campo `data.chapters` contém objetos com `file` e `title`. Use esse par para relacionar o sumário com o arquivo de origem. O exemplo abaixo usa Node.js e roda dentro de um projeto de livro. O processo filho herda a pasta atual.

```js
import { execFileSync } from "node:child_process";

const resposta = execFileSync("ebookfy", ["info", "--json"], {
  encoding: "utf8",
});
const { data } = JSON.parse(resposta);
for (const [indice, capitulo] of data.chapters.entries()) {
  console.log(indice + 1, capitulo.title, capitulo.file);
}
```

Se o CLI encerrar com erro, `execFileSync` lança uma exceção. Em um fluxo que trata falhas individualmente, use `spawnSync` e examine `status` e `stdout` antes de acessar `data`. Para consultar o guia editorial sem rede, execute `ebookfy --skill ebook`. O mesmo tópico está disponível na aba Docs e pelo MCP.

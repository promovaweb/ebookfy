# Interpretar os códigos de saída

Zero é sucesso. Cada família de falha tem um número fixo. Scripts e agentes
devem tratar o code antes de interpretar a mensagem.

| Code | Name | Quando |
| --- | --- | --- |
| 0 | `SUCCESS` | operação concluída |
| 1 | `GENERIC_ERROR` | falha inesperada sem classificação |
| 2 | `USAGE` | arguments, options ou subcommand inválidos; também quando o binário roda sem argumentos fora de um TTY |
| 3 | `CONFIG` | `ebook.toml` ou settings.json ausente, inválido ou com key desconhecida; arquivo declarado na ficha não encontrado |
| 4 | `CREDENTIALS` | credentials.json ilegível, master key ausente ou credencial não encontrada |
| 5 | `NETWORK_OR_API` | falha de rede ou resposta de API fora do esperado |
| 6 | `NOT_FOUND` | recurso solicitado não existe |
| 7 | `PERMISSION` | permissão negada no sistema de arquivos |
| 8 | `NO_TTY` | a TUI exige um terminal interativo |
| 9 | `MCP` | o servidor MCP falhou ao iniciar ou perdeu o transporte |
| 130 | `INTERRUPTED` | entrada cancelada ou processo interrompido com Ctrl+C |

A fonte única é `src/app/exit-codes.ts`. A mesma tabela aparece em `--help`,
em `--opencli`, na tool MCP `exit_codes` e na resource `ebookfy://exit-codes`.

## Diagnosticar uma falha no livro

| Sintoma | O que verificar | Como confirmar a correção |
| --- | --- | --- |
| A ficha informa que nenhum ebook.toml foi encontrado | Confira a pasta atual e a raiz Git. Repositórios vizinhos podem ter seus próprios livros. | Entre na pasta do livro e execute `ebookfy info`. |
| A configuração indica um campo inválido | Confira o nome da tabela, as aspas da data e a lista de formatos. | Compare com a ficha completa do capítulo de configuração. |
| O CLI informa um arquivo ausente | Abra o caminho a partir da raiz do livro e confira maiúsculas e minúsculas. | Consulte a ficha novamente. |
| Um capítulo aparece com título incorreto | Localize o primeiro título de nível 1 no arquivo indicado. | Salve o capítulo e recarregue a TUI com `r`. |
| A ficha abre e o build falha ao ler uma figura | Abra a imagem pelo caminho usado no Markdown, relativo ao capítulo. | Compile EPUB e procure a figura no capítulo. |
| A geração falha ao iniciar um conversor | Execute `ebookfy doctor` na pasta do livro para identificar o conversor ausente e os formatos afetados. | Disponibilize o conversor no PATH, confira a versão com `ebookfy doctor` e repita o build. |
| `A saída precisa ficar em uma pasta local do projeto.` | Confira se a pasta de saída ou alguma pasta do caminho passa por um link simbólico. | Aponte `output.directory` para uma pasta local dentro do livro e compile de novo. |
| A TUI exige um terminal interativo | Confira se você está em um pipe ou job automatizado. | Use `ebookfy info --json` para a ficha ou abra a TUI em um terminal. |

## Preservar o código de saída no shell

Capture o código imediatamente no ramo de falha. O exemplo trata a ausência de livro separadamente e devolve os demais erros ao processo que chamou o script.

```bash
if ebookfy info --json; then
  echo "Ficha carregada." >&2
else
  codigo=$?
  case "$codigo" in
    6) echo "Confira a pasta do livro e seu ebook.toml." >&2 ;;
    *) echo "A consulta falhou com código $codigo." >&2 ;;
  esac
  exit "$codigo"
fi
```

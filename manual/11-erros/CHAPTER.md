# Interpretar os códigos de saída

Zero é sucesso. Cada família de falha tem um número fixo. Scripts e agentes
devem tratar o code antes de interpretar a mensagem.

| Code | Name | Quando |
| --- | --- | --- |
| 0 | `SUCCESS` | operação concluída |
| 1 | `GENERIC_ERROR` | falha inesperada sem classificação |
| 2 | `USAGE` | arguments, options ou subcommand inválidos; também quando o binário roda sem argumentos fora de um TTY |
| 3 | `CONFIG` | settings.json ausente, inválido ou key desconhecida |
| 4 | `CREDENTIALS` | credentials.json ilegível, master key ausente ou credencial não encontrada |
| 5 | `NETWORK_OR_API` | falha de rede ou resposta de API fora do esperado |
| 6 | `NOT_FOUND` | recurso solicitado não existe |
| 7 | `PERMISSION` | permissão negada no sistema de arquivos |
| 8 | `NO_TTY` | a TUI exige um terminal interativo |
| 9 | `MCP` | o servidor MCP falhou ao iniciar ou perdeu o transporte |
| 130 | `INTERRUPTED` | entrada cancelada ou processo interrompido com Ctrl+C |

A fonte única é `src/app/exit-codes.ts`. A mesma tabela aparece em `--help`,
em `--opencli`, na tool MCP `exit_codes` e na resource `ebookfy://exit-codes`.

## Em shell

```bash
if ! ebookfy credentials get github.token --json > /tmp/out.json; then
  case $? in
    4) echo "save the credential with: ebookfy credentials set github.token" ;;
    *) echo "failed: see /tmp/out.json" ;;
  esac
fi
```

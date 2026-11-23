# Conectar agentes via MCP

`ebookfy mcp` transforma o processo em um servidor Model Context Protocol
sobre stdio. Nada mais é escrito em stdout; diagnósticos vão para stderr.

## Configuração no cliente

```json
{
  "mcpServers": {
    "ebookfy": { "command": "ebookfy", "args": ["mcp"] }
  }
}
```

Para o Claude Code: `claude mcp add ebookfy -- ebookfy mcp`.
Para desenvolvimento, sem compilar: `"command": "bun", "args": ["run", "src/main.ts", "mcp"]`.

## Tools

| Tool | Entrada | Saída |
| --- | --- | --- |
| `ebook_info` | nenhuma | Ficha, capítulos e formatos do livro na pasta do servidor. |
| `doctor` | nenhuma | `{ checks, ok }`; `isError: true` se houver `fail` |
| `about` | nenhuma | identity, runtime, platform, data directory e credits |
| `exit_codes` | nenhuma | tabela de exit codes |
| `skill` | `topic?` (`cli`, `tui`, `mcp`, `config`, `exit-codes`, `reference`) | documentação em Markdown |
| `config_list` | nenhuma | keys de settings.json em vigor e o schema |
| `config_get` | `key` | valor da key; `isError` quando não existe |
| `credentials_status` | nenhuma | file, master key source, count e names |

Nenhuma tool devolve o valor de uma credencial e todas operam em modo de leitura. Escrita
continua no CLI, onde há confirmação humana.

## Resources

| URI | Conteúdo |
| --- | --- |
| `ebookfy://about` | identity em JSON |
| `ebookfy://exit-codes` | exit codes em JSON |
| `ebookfy://skill` | documentação completa em Markdown |
| `ebookfy://skill/{topic}` | uma seção; o template lista os topics |

## Prompts

| Prompt | Arguments | Função |
| --- | --- | --- |
| `operate` | `task` | instrui o agente a ler `skill cli` e executar a task pelo CLI com `--json` |

## Listar sem iniciar

```bash
ebookfy mcp --list
ebookfy mcp --list --json
```

## Testar

```bash
npx @modelcontextprotocol/inspector ebookfy mcp
```

O Inspector abre uma página local para chamar tools, ler resources e
inspecionar as mensagens JSON-RPC.

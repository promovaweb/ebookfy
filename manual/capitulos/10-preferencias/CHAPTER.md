# Configurar o ambiente local

As preferências do aplicativo e o cofre local ficam em `~/.ebookfy/`:

| Arquivo | Conteúdo | Permissão |
| --- | --- | --- |
| `settings.json` | preferências em texto claro | 0600 |
| `credentials.json` | envelope AES-256-GCM com os segredos | 0600 |
| `master.key` | master key em hexadecimal, criada na primeira gravação | 0600 |

A pasta é criada com 0700. A variável `EBOOKFY_HOME` troca a raiz, útil em
testes e CI.

## settings.json

Use as chaves abaixo em notação de ponto. Elas controlam o aplicativo. O conteúdo e os formatos de cada livro ficam no seu próprio `ebook.toml`.

| Key | Tipo | Padrão | Função |
| --- | --- | --- | --- |
| `output.format` | `text` ou `json` | `text` | formato padrão da saída do CLI |
| `output.colors` | boolean | `true` | cores ANSI na saída de texto |
| `tui.icons` | `auto`, `nerd`, `unicode` ou `ascii` | `auto` | conjunto de ícones da TUI; `auto` usa `nerd` no Ghostty, no Kitty, no WezTerm e no Omarchy, `ascii` no console Linux e `unicode` nos demais terminais |
| `tui.initialTab` | `overview`, `settings`, `credentials`, `docs` ou `about` | `overview` | aba aberta ao iniciar a TUI |
| `tui.motion` | boolean | `true` | animações curtas de diálogos e toasts; `false` deixa a interface estática |
| `tui.mouse` | boolean | `true` | mouse na TUI: clique, hover e roda. `false` devolve a seleção de texto ao terminal |
| `tui.theme` | `terminal`, `night` ou `day` | `terminal` | paleta da TUI |
| `telemetry.enabled` | boolean | `false` | reservado para projetos derivados |

Exemplos de configuração

```bash
ebookfy config list
ebookfy config get tui.theme
ebookfy config set output.format json
ebookfy config unset telemetry.enabled
ebookfy config path
ebookfy config schema
```

Keys fora do schema são aceitas como texto. Para que uma key nova ganhe tipo,
padrão e documentação, acrescente-a a `SETTINGS_SCHEMA` em
`src/config/settings.ts`.

## credentials.json

O arquivo guarda um envelope:

```json
{ "version": 1, "algorithm": "aes-256-gcm", "iv": "<base64>", "tag": "<base64>", "data": "<base64>" }
```

`data` é o JSON `{ "name": "value" }` cifrado. Names seguem
`[a-z0-9][a-z0-9_.-]{0,63}`, por exemplo `openai.api_key` ou `github.token`.

A master key tem 32 bytes e vem, nesta ordem:

1. da variável `EBOOKFY_MASTER_KEY` (64 caracteres hexadecimais);
2. do arquivo `master.key`, gerado automaticamente.

Gere uma chave para a variável com `openssl rand -hex 32`. Quando a variável
está definida, `master.key` é ignorado.

Exemplos de configuração

```bash
ebookfy credentials set openai.api_key            # digita sem eco
printf '%s' "$TOKEN" | ebookfy credentials set github.token --stdin
ebookfy credentials get openai.api_key            # mascarado
ebookfy credentials get openai.api_key --reveal   # em claro
ebookfy credentials list
ebookfy credentials remove github.token
ebookfy credentials status
ebookfy credentials clear --yes
```

## O que a cifra protege

A cifra protege o arquivo contra leitura casual, cópia em backup e varredura
do disco por outras ferramentas. Um processo que roda com o mesmo usuário do
sistema consegue ler `master.key` e decifrar o conteúdo. Para um nível acima, injete a
chave por `EBOOKFY_MASTER_KEY` a partir de um gerenciador de segredos e não
grave `master.key` em disco.

## Usar uma credencial no código

```ts
import { getCredential } from "../config/credentials.ts";

const token = getCredential("github.token"); // lança AppError(4) quando não existe
```

O valor fica fora de log, de mensagem de erro, de `data` do `--json` e de
resposta de tool MCP.

## Variáveis de ambiente

| Variável | Efeito |
| --- | --- |
| `EBOOKFY_HOME` | troca `~/.ebookfy/` por outra pasta |
| `EBOOKFY_MASTER_KEY` | master key em hex; dispensa `master.key` |
| `NO_COLOR` | desliga cores na saída de texto |

## Rotação da master key

| Command ou option | Efeito |
| --- | --- |
| `credentials rotate-key` | Gera chave aleatória, recifra o cofre e grava `master.key` com 0600. |
| `credentials rotate-key --from-env` | Lê a chave atual de `master.key` e usa `EBOOKFY_MASTER_KEY` como chave nova. |

`ebookfy credentials rotate-key` abre o cofre com a chave atual e preserva
seus valores ao recifrar. A opção `--from-env` exige a chave atual em disco
e uma chave nova de 64 caracteres hexadecimais na variável. A chave nova
também é gravada em `master.key` com 0600. Sem cofre ou chave atual, o command
retorna exit code 4 (`CREDENTIALS`). Em JSON, retorna `{ rotated, source }`,
sem o conteúdo das chaves.

Sem `--from-env`, se a chave anterior veio da variável, remova essa variável
do shell após a rotação: `unset EBOOKFY_MASTER_KEY`. Ela tem prioridade sobre
o arquivo nas próximas execuções. Não execute gravações no cofre durante a
rotação. Os dois arquivos são preparados antes da substituição; falhas de
gravação comuns restauram a chave anterior por substituição atômica. Se essa
restauração também falhar, os arquivos de recuperação ficam na pasta
`.rotate-*` indicada pelo erro; a cópia `previous.key` mantém permissão 0600. Como são dois arquivos, uma
interrupção do processo entre as substituições exige recuperação de backup.

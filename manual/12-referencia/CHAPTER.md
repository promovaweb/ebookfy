# Referência dos comandos da edição

## Reference generated from the command registry

### Global options

- `-h`, `--help`: Show help for the current command and exit with code 0.
- `-V`, `--version`: Print the version and exit with code 0.
- `--json`: Return JSON output with the envelope { ok, command, data } or { ok, command, error }. Errors are JSON too.
- `--skill` `[topic]`: Print the full documentation embedded in the binary, written for AI agents. With a topic, print only that section. Values: cli, tui, mcp, config, exit-codes, reference.
- `--opencli`: Print the OpenCLI description (JSON) of the whole command tree.
- `--no-color`: Disable ANSI colors in text output. Same as NO_COLOR=1.

### `ebookfy info`

Consulte metadados, formatos e capítulos do ebook.

### `ebookfy build`

Compile os formatos declarados em ebook.toml.

### `ebookfy tui`

Open the terminal interface (Overview and About). Requires a TTY.

Options:

- `--tab` `<tab>`: Initial tab. Overrides tui.initialTab from settings.json. Values: overview, about.

Exit codes besides 0, 1 and 2: 8 (NO_TTY).

Requires an interactive terminal or `--stdin`/`--yes` as applicable.

Examples:

```bash
ebookfy
ebookfy tui --tab about
```

### `ebookfy about`

Show version, executable, runtime, platform and credits.

Examples:

```bash
ebookfy about
ebookfy about --json
```

### `ebookfy config`

Read and write preferences in ~/.ebookfy/settings.json.

Preferences are stored in plain text at /home/luizeof/.ebookfy/settings.json. Nested keys use dot notation. Keys outside the schema are accepted as text to leave room for project extensions. Secrets never go here: use "ebookfy credentials".

Exit codes besides 0, 1 and 2: 3 (CONFIG), 6 (NOT_FOUND), 7 (PERMISSION).

### `ebookfy config list`

List every key with its effective value (file merged with defaults).

Exit codes besides 0, 1 and 2: 3 (CONFIG), 6 (NOT_FOUND), 7 (PERMISSION).

Examples:

```bash
ebookfy config list
ebookfy config list --json
```

### `ebookfy config get`

Show the value of a key.

Arguments:

- `<key>`: Key in dot notation, e.g. output.format.

Exit codes besides 0, 1 and 2: 3 (CONFIG), 6 (NOT_FOUND), 7 (PERMISSION).

Examples:

```bash
ebookfy config get tui.initialTab
```

### `ebookfy config set`

Write a value to settings.json, converting the type according to the schema.

Arguments:

- `<key>`: Key in dot notation.
- `<value>`: Value as text. Booleans accept true/false, yes/no, 1/0, on/off.

Exit codes besides 0, 1 and 2: 3 (CONFIG), 6 (NOT_FOUND), 7 (PERMISSION).

Examples:

```bash
ebookfy config set output.format json
ebookfy config set output.colors false
```

### `ebookfy config unset`

Remove a key from the file. The key falls back to its default, if any.

Arguments:

- `<key>`: Key in dot notation.

Exit codes besides 0, 1 and 2: 3 (CONFIG), 6 (NOT_FOUND), 7 (PERMISSION).

Examples:

```bash
ebookfy config unset telemetry.enabled
```

### `ebookfy config path`

Print the data directory and file paths.

Examples:

```bash
ebookfy config path
```

### `ebookfy config schema`

List the known keys with type, default and description.

Examples:

```bash
ebookfy config schema --json
```

### `ebookfy credentials`

Store encrypted secrets (AES-256-GCM) in ~/.ebookfy/credentials.json.

Values are encrypted with a 32-byte master key. The key comes from the variable EBOOKFY_MASTER_KEY (64 hex characters) or from master.key, created with mode 0600 on first write. Commands that call APIs read the value with getCredential(name) and exit with code 4 when the credential does not exist.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

### `ebookfy credentials set`

Save or replace a credential. The value is read without echo or from stdin.

Arguments:

- `<name>`: Credential identifier: lower-case letters, digits, dot, hyphen and underscore (e.g. openai.api_key).

Options:

- `--stdin`: Force reading the value from the first stdin line, even on an interactive terminal.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

Requires an interactive terminal or `--stdin`/`--yes` as applicable.

Examples:

```bash
ebookfy credentials set openai.api_key
printf '%s' "$TOKEN" | ebookfy credentials set github.token --stdin
```

### `ebookfy credentials get`

Show a masked credential. Use --reveal for the full value.

Arguments:

- `<name>`: Credential identifier.

Options:

- `--reveal`: Print the value in clear. In --json the field becomes `value`.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

Examples:

```bash
ebookfy credentials get openai.api_key
ebookfy credentials get openai.api_key --reveal
```

### `ebookfy credentials list`

List saved names. Never shows values.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

Examples:

```bash
ebookfy credentials list --json
```

### `ebookfy credentials remove`

Remove a credential from the vault.

Arguments:

- `<name>`: Credential identifier.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

Examples:

```bash
ebookfy credentials remove github.token
```

### `ebookfy credentials status`

Show file, master key source and number of credentials.

Examples:

```bash
ebookfy credentials status
```

### `ebookfy credentials clear`

Delete credentials.json entirely. Keeps master.key. Asks for confirmation on a terminal.

Options:

- `-y`, `--yes`: Skip the confirmation.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

Requires an interactive terminal or `--stdin`/`--yes` as applicable.

Examples:

```bash
ebookfy credentials clear --yes
```

### `ebookfy credentials rotate-key`

Re-encrypt the existing vault with a new master key and write master.key with mode 0600.

With --from-env, master.key decrypts the vault and EBOOKFY_MASTER_KEY supplies the new key. Without it, a random key is generated; unset the old environment variable in your shell afterward.

Options:

- `--from-env`: Use EBOOKFY_MASTER_KEY (64 hex characters) as the new key; read the current key from master.key.

Exit codes besides 0, 1 and 2: 4 (CREDENTIALS), 7 (PERMISSION), 130 (INTERRUPTED).

### `ebookfy mcp`

Start the MCP server (stdio) with tools, resources and prompts for agents.

Configure in the MCP client: { "command": "ebookfy", "args": ["mcp"] }. Run "ebookfy mcp --list" to see the registered tools, resources and prompts. No tool returns the value of a credential.

Options:

- `--list`: Instead of starting the server, list registered tools, resources and prompts and exit.

Exit codes besides 0, 1 and 2: 9 (MCP).

Examples:

```bash
ebookfy mcp
ebookfy mcp --list --json
```

### `ebookfy skill`

Print the embedded documentation, whole or by topic. Same effect as --skill.

Arguments:

- `[topic]`: Desired section. Without it, prints everything. Values: cli, tui, mcp, config, exit-codes, reference.

Examples:

```bash
ebookfy skill
ebookfy skill mcp
ebookfy --skill cli
```

### `ebookfy doctor`

Check runtime, terminal, settings, key source and vault readability without changing files.

Exit codes besides 0, 1 and 2: 3 (CONFIG).

### `ebookfy completion`

Print a registry-generated completion script for bash, zsh or fish.

Consulte os comandos de instalação na seção de completion do capítulo sobre o CLI.

Arguments:

- `<shell>`: Shell to generate completion for: bash, zsh or fish. Values: bash, zsh, fish.

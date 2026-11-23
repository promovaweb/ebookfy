# Referência dos comandos da edição

Execute os comandos do livro dentro do projeto. Os comandos de preferências e diagnóstico também podem ser usados fora dele. Para obter a sintaxe exata da instalação disponível, acrescente `--help` ao comando ou subcomando. A marcação `<campo>` neste capítulo indica um argumento obrigatório e `[campo]` indica um argumento opcional.

## Iniciar o projeto

Execute `ebookfy init` na pasta vazia do livro. A operação usa o Git para obter o starter kit privado e aceita um repositório que já contém a entrada `.git`. Com `ebookfy init --json`, os campos `data.diretorio`, `data.template`, `data.versao` e `data.entradas` registram o destino, a origem, a tag do modelo e as entradas instaladas na raiz. Para conferir o acesso antes de iniciar, execute `git ls-remote https://github.com/promovaweb/ebookfy-starter-kit.git refs/tags/v0.3.0`.

## Consultar e compilar

| Comando | Entrada | Resultado |
| --- | --- | --- |
| `ebookfy info` | O TOML mais próximo e as fontes editoriais indicadas nele. | Título, autoria, edição, descrição, formatos e capítulos em ordem. |
| `ebookfy info --json` | A mesma ficha. | Metadados, caminhos editoriais, configuração de saída e pares de caminho e título em `data.chapters`. |
| `ebookfy build` | Fontes do livro, imagens e conversores dos formatos escolhidos. | Um caminho por arquivo gerado. |
| `ebookfy build --json` | A mesma configuração de compilação. | Lista dos arquivos em `data.arquivos`. |

Para confirmar o destino antes de exportar um livro grande, consulte `data.output` na ficha. Para registrar uma entrega, guarde a lista retornada pelo build junto com a versão do livro. A primeira consulta descreve a configuração. A segunda identifica os arquivos que aquela execução acabou de gerar.

## Abrir as telas de trabalho

`ebookfy` abre a TUI quando a entrada e a saída estão ligadas a um terminal interativo. Use `ebookfy tui --tab <aba>` para ir a uma tela específica. Os valores são `overview` para a ficha do livro, `settings` para preferências, `credentials` para o cofre, `docs` para documentação e `about` para informações do aplicativo.

Em um terminal sem interface gráfica, a TUI continua disponível desde que haja um TTY. Em uma execução redirecionada por pipe, prefira o comando correspondente em texto ou JSON. Por exemplo, `ebookfy about --json` traz versão, runtime e plataforma, enquanto `ebookfy info --json` traz os dados do manuscrito.

## Configurar preferências

| Comando | Uso |
| --- | --- |
| `ebookfy config list` | Conferir as preferências em vigor. |
| `ebookfy config schema` | Consultar chaves, tipos e valores admitidos. |
| `ebookfy config get <chave>` | Ler um valor, como `tui.theme`. |
| `ebookfy config set <chave> <valor>` | Gravar uma preferência pessoal. |
| `ebookfy config unset <chave>` | Remover o valor salvo e voltar ao padrão da chave. |
| `ebookfy config path` | Mostrar a pasta de dados e os caminhos de `settings.json`, `credentials.json` e `master.key`. |

Para experimentar o tema usado nas capturas, execute `ebookfy config set tui.theme night` e reabra a TUI. Para voltar à configuração padrão, execute `ebookfy config unset tui.theme`. A mudança vale para o perfil local utilizado pelo processo.

## Operar o cofre

O fluxo de escrita e exportação de um ebook local pode ser feito sem configurar credenciais. Os comandos abaixo ficam disponíveis para integrações que precisam guardar um segredo no perfil do aplicativo.

| Comando | Uso |
| --- | --- |
| `ebookfy credentials status` | Consultar o estado do cofre e a origem da chave. |
| `ebookfy credentials list` | Listar os identificadores cadastrados. |
| `ebookfy credentials set <nome>` | Cadastrar um valor pelo prompt. A opção `--stdin` lê a primeira linha da entrada padrão. |
| `ebookfy credentials get <nome>` | Consultar a entrada com o valor mascarado. A opção `--reveal` exibe o conteúdo. |
| `ebookfy credentials remove <nome>` | Remover uma entrada específica. |
| `ebookfy credentials clear` | Apagar `credentials.json` e manter `master.key`. Sem `--yes`, pede confirmação no terminal interativo e sai com código 130 fora de um TTY. |
| `ebookfy credentials rotate-key` | Recifrar os valores com uma nova chave. Com `--from-env`, a nova chave vem de `EBOOKFY_MASTER_KEY`. |

Escolha identificadores com letras minúsculas, números, ponto, hífen ou sublinhado. A documentação do perfil explica permissões, chave mestra e rotação. Ao coletar uma saída para suporte, a consulta de estado fornece os dados operacionais sem imprimir o conteúdo das entradas.

## Documentação, agentes e diagnóstico

| Comando | Uso |
| --- | --- |
| `ebookfy skill [tópico]` ou `ebookfy --skill [tópico]` | Ler a documentação embutida. Use `ebook`, `cli`, `tui`, `mcp`, `config`, `exit-codes` ou `reference`. Sem tópico, retorna o conjunto completo. |
| `ebookfy --opencli` | Obter a descrição da árvore de comandos em JSON. |
| `ebookfy mcp --list` | Listar as ferramentas, recursos e prompts registrados. |
| `ebookfy mcp` | Iniciar o servidor MCP em comunicação por stdio. O processo aguarda mensagens de um cliente. |
| `ebookfy doctor` | Conferir runtime, terminal, configuração e cofre locais. Para validar os conversores do livro, consulte o capítulo de exportação. |
| `ebookfy about` | Consultar versão, executável, plataforma, projeto e créditos. |
| `ebookfy completion <shell>` | Gerar a configuração de autocompletar para `bash`, `zsh` ou `fish`. |

As opções globais incluem `--help` ou `-h`, `--version` ou `-V`, `--json` e `--no-color`. Para consultar opções em um nível específico, execute, por exemplo, `ebookfy credentials set --help`. Para examinar o contrato completo usado pelo CLI da máquina, execute `ebookfy --skill reference`.

# Documentação do Ebookfy

Use o [starter kit privado](https://github.com/promovaweb/ebookfy-starter-kit) para criar um projeto com uma ficha TOML, um capítulo ilustrado e as 15 skills instaladas. Para iniciar um repositório vazio com o livro de exemplo, instale o CLI e execute `ebookfy init` na raiz. Se já tem um manuscrito, comece pelo guia de migração.

## Produzir o livro

| Guia | O que você consegue fazer |
| --- | --- |
| [Primeira edição](../manual/capitulos/01-primeira-edicao/CHAPTER.md) | Instalar as ferramentas, personalizar o exemplo e abrir a primeira prova. |
| [Ficha do livro](../manual/capitulos/02-configuracao/CHAPTER.md) | Preencher o TOML completo, selecionar formatos e distinguir a versão do livro da versão do aplicativo. |
| [Capítulos e imagens](../manual/capitulos/03-capitulos/CHAPTER.md) | Acrescentar um capítulo ilustrado, configurar o sumário e preparar capa, prefácio, créditos e autoria. |
| [Migração](../manual/capitulos/04-migracao/CHAPTER.md) | Transferir um manuscrito único ou um guia de projeto e conferir a nova ordem de leitura. |
| [Exportação](../manual/capitulos/05-exportacao/CHAPTER.md) | Gerar os três formatos, localizar os arquivos e verificar uma cópia distribuída. |
| [Skills editoriais](../manual/capitulos/06-skills/CHAPTER.md) | Escolher a etapa do agente e conduzir a revisão de um capítulo. |

## Operar o aplicativo

| Guia | O que consultar |
| --- | --- |
| [Interface de terminal](../manual/capitulos/07-terminal/CHAPTER.md) | Captura da aba Livro, navegação pelo teclado, recarga e leitura da documentação. |
| [CLI e JSON](../manual/capitulos/08-comandos/CHAPTER.md) | Opções globais, envelopes de resposta e leitura do sumário com Node.js. |
| [Servidor MCP](../manual/capitulos/09-agentes/CHAPTER.md) | Configuração do cliente, diretório de trabalho, ferramentas, recursos e prompts. |
| [Preferências e credenciais](../manual/capitulos/10-preferencias/CHAPTER.md) | Arquivos locais, temas, variáveis de ambiente e rotação de chave. |
| [Diagnóstico](../manual/capitulos/11-erros/CHAPTER.md) | Sintomas comuns, códigos de saída e tratamento de falhas no shell. |
| [Referência dos comandos](../manual/capitulos/12-referencia/CHAPTER.md) | Argumentos, opções e exemplos da edição. |

Para consultar o guia editorial no próprio terminal, execute `ebookfy --skill ebook`. Para buscar a sintaxe de um comando instalado, use `ebookfy --skill reference`.

## Ler o manual completo

O manual reúne os doze guias na ordem configurada no [TOML do manual](../manual/ebook.toml). Escolha [PDF](../manual/ebook/manual-ebookfy-v0.5.1.pdf) para páginas fixas, [EPUB](../manual/ebook/manual-ebookfy-v0.5.1.epub) para ajustar a fonte no leitor ou [MOBI](../manual/ebook/manual-ebookfy-v0.5.1.mobi) para leitores compatíveis.

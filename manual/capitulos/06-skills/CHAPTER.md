# Escolher e executar as skills

As 15 skills numeradas acompanham um livro da organização à entrega. Cada uma é uma pasta com um `SKILL.md`, que traz quando usar, o procedimento, as regras do Ebookfy que afetam aquela etapa, uma tabela de problemas frequentes e uma checklist da entrega, e uma pasta `references/` com modelos e exemplos completos. No starter kit, elas ficam em `.agents/skills/`.

## O percurso

| Etapa | Use quando | Produz |
| --- | --- | --- |
| `ebookfy-01-organizar` | Começar um livro, organizar uma pasta ou corrigir a ficha. | `ebook.toml` válido, árvore de pastas e `notas/briefing.md`. |
| `ebookfy-02-pesquisar` | Apurar afirmações, comandos e imagens antes de escrever. | `notas/fontes.md` com fonte e situação de cada afirmação. |
| `ebookfy-03-planejar` | Definir ou mudar a ordem de leitura. | `notas/sumario.md`, pastas dos capítulos e `[[chapters]]` na ordem. |
| `ebookfy-04-capitulos` | Escrever, reescrever, dividir, fundir ou mover capítulos. | `CHAPTER.md` completo, com exemplos executados. |
| `ebookfy-05-imagens` | Inserir, trocar ou corrigir figuras. | Figuras em `imagens/` com legenda útil e origem registrada. |
| `ebookfy-06-capa` | Criar ou atualizar a capa digital e conferir a capa do PDF. | `files.cover`, `files.logo` e a prova nos três formatos. |
| `ebookfy-07-introducao` | Abrir o livro e levar o leitor à primeira ação. | Abertura do primeiro capítulo ou capítulo de introdução. |
| `ebookfy-08-prefacio` | Apresentar a obra antes dos capítulos. | Texto de `files.preface`. |
| `ebookfy-09-creditos` | Consolidar atribuições e licenças antes de distribuir. | Texto de `files.credits` e `notas/atribuicoes.md` reconciliado. |
| `ebookfy-10-autor` | Escrever ou conferir a apresentação de autoria. | Texto de `files.author`. |
| `ebookfy-11-conclusao` | Fechar a leitura com resultado e conferência final. | Encerramento do último capítulo ou capítulo final. |
| `ebookfy-12-revisar` | Revisar a edição na ordem de leitura, executando os exemplos. | `notas/revisao.md` com achados, correções e verificações. |
| `ebookfy-13-exportar` | Compilar e conferir os exemplares, ou investigar uma falha do build. | Arquivos em `output.directory` e a prova em `notas/entrega.md`. |
| `ebookfy-14-distribuir` | Entregar a edição aprovada e conferir a cópia recebida. | Hashes, links e testes de acesso em `notas/entrega.md`. |
| `ebookfy-15-migrar` | Trazer um livro que já existe em outro formato. | Projeto Ebookfy e `notas/migracao.md` com o mapa. |

A ordem serve para um livro novo. Para uma tarefa pontual, entre direto na etapa: trocar uma figura começa na 05, passa pela 09 e termina na 13; um livro antigo começa na 15 e segue para a 01, a 12 e a 13.

## As notas de trabalho

As skills combinam entre si pelos arquivos de `notas/`, na raiz do livro. Cada etapa grava o seu registro e a seguinte o consulta: a pesquisa lê o briefing, a redação lê o sumário e as fontes, os créditos leem as atribuições que as etapas de imagem e capa acumularam, a distribuição lê a prova da exportação. Como `notas/` fica fora de `[[chapters]]`, nada dali entra na edição. A tabela completa dos arquivos está no capítulo de configuração.

## O que as skills sabem do compilador

As skills descrevem o comportamento real do Ebookfy, conferido em compilação:

- o texto entre colchetes de uma figura vira legenda visível e texto alternativo;
- links entre capítulos usam a âncora do título, porque link para outro `CHAPTER.md` fica quebrado na edição;
- títulos repetidos ganham sufixo no identificador, e rótulos de nota repetidos entre capítulos derrubam o build;
- qualquer aviso do Pandoc interrompe a compilação;
- frontmatter YAML não é lido e vira texto;
- a capa do PDF é tipográfica, e `files.cover` vale para o EPUB e o MOBI.

Por isso a etapa 04 traz uma referência do Markdown aceito, a 12 traz comandos para achar esses problemas antes do build e a 13 traz uma tabela de diagnóstico por mensagem de erro.

## Usar as referências e as checklists

Abra primeiro o `SKILL.md` da etapa. O procedimento indica o passo onde cada referência ajuda: o modelo de briefing na etapa 01, a ficha de apuração na 02, a anatomia do capítulo e o Markdown do Ebookfy na 04, as provas de capa na 06, as passadas de revisão na 12. Os exemplos das referências usam um livro fictício, *Primeiros fluxos no n8n*, para mostrar cada registro preenchido.

Na checklist, marque somente o que você conferiu e diga onde conferiu: o arquivo lido, o comando executado, o exemplar aberto.

## Conduzir uma revisão com o agente

Suponha que você já tenha o segundo capítulo do exercício **Caderno da oficina**, criado no capítulo 3 deste manual em `capitulos/02-oficina/CHAPTER.md`, com texto e a figura provisória `imagens/livro.png`. Abra o agente na pasta do livro e peça uma revisão dirigida:

> Use ebookfy-12-revisar no capítulo "Conferir o material da oficina". Faça só o diagnóstico, sem editar. Confira se os passos permitem preparar a bancada com os materiais citados, se a figura está na pasta do capítulo com legenda que diz o que observar e se a origem dela está em notas/atribuicoes.md. Registre os achados em notas/revisao.md.

O agente lê o capítulo na ordem, executa o que for executável e registra cada achado com o local, o efeito no leitor, a correção proposta e a gravidade. Leia o registro ao lado do capítulo. Para corrigir, peça o ajuste de um achado específico e a repetição da verificação que o revelou. A revisão examina o texto e os exemplos; a compilação confere outra coisa, a leitura dos arquivos e dos formatos.

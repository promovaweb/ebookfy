# Preencher a ficha no ebook.toml

Use o arquivo da raiz como ficha da edição. O título de cada capítulo vem do primeiro heading de nível 1 do seu CHAPTER.md. A ordem de leitura vem das tabelas [[chapters]].

| Campo | Conteúdo |
| --- | --- |
| book.title, book.subtitle | Título e subtítulo. O subtítulo é opcional. |
| book.description | Apresentação da edição para o catálogo. |
| book.authors | Lista de autores na ordem dos créditos. |
| book.publisher, book.rights | Editora responsável e declaração de direitos. |
| book.identifier | Identificador estável do livro, por exemplo uma URN. |
| book.language | Idioma, por exemplo pt-BR. |
| book.date, book.version | Data entre aspas no formato AAAA-MM-DD e edição no formato X.Y.Z. |
| book.slug | Letras minúsculas sem acento, números e hífen. Forma o nome dos arquivos. |
| files.cover | Imagem de capa de EPUB e MOBI. Prefira PNG ou JPEG. |
| files.logo | Símbolo opcional usado na composição A4. Sem ele, o PDF usa a imagem de capa nesse espaço. |
| files.preface, files.credits, files.author | Arquivos Markdown do prefácio, créditos e autoria. |
| chapters.file | Caminho de um CHAPTER.md por tabela, na ordem de leitura. |
| output.directory | Pasta dos resultados, relativa à raiz. |
| output.formats | Lista com pdf, epub e mobi. Selecione um, dois ou os três. |

No exercício iniciado no capítulo 1, o slug `caderno-da-oficina` e a versão `1.0.0` produzem `caderno-da-oficina-v1.0.0.epub` quando EPUB está selecionado. Preserve o identificador ao corrigir o texto da mesma obra. Use uma nova versão para manter a edição anterior disponível.

## Uma ficha completa para adaptar

Na raiz do **Caderno da oficina** criado no capítulo 1, use esta ficha para preparar a edição nos três formatos. Salve-a como `ebook.toml` e execute `ebookfy info --json` para conferir os campos.

```toml
[book]
title = "Caderno da oficina"
subtitle = "Preparação da bancada"
description = "Materiais, montagem e conferência antes da primeira atividade."
authors = ["Equipe da oficina"]
publisher = "Oficina de exemplo"
rights = "Distribuição interna da oficina"
identifier = "urn:oficina:caderno"
language = "pt-BR"
date = "2026-11-23"
version = "1.0.0"
slug = "caderno-da-oficina"

[files]
preface = "editorial/prefacio.md"
credits = "editorial/creditos.md"
author = "editorial/autor.md"
cover = "editorial/capa.png"
logo = "brand/logo/icon.png"

[output]
directory = "ebook"
formats = ["pdf", "epub", "mobi"]

[[chapters]]
file = "capitulos/01-primeiro-capitulo/CHAPTER.md"
```

O TOML agrupa os dados da obra, os caminhos editoriais e a exportação em tabelas. Cada `[[chapters]]` acrescenta um item à lista. Para inserir um capítulo entre dois existentes, coloque sua tabela na posição desejada. O nome da pasta pode continuar igual mesmo quando o capítulo muda de posição.

## Separar a edição do livro da versão do aplicativo

A versão que `ebookfy --version` imprime identifica o aplicativo instalado. Já `book.version` identifica o manuscrito. Os dois números podem ser diferentes. Para publicar uma revisão do conteúdo mantendo a edição anterior disponível, altere a versão do livro e confira os novos nomes em `ebookfy build --json`.

Escreva os caminhos em relação à pasta do TOML. Um caminho absoluto ou que aponte para fora do livro causa o erro `Caminho fora do projeto`. Cada texto editorial precisa existir e ter um título de nível 1. A lista exige pelo menos um capítulo e um formato. A ficha rejeita campos desconhecidos, entradas de capítulo repetidas e a repetição do mesmo formato. Ao corrigir um caminho, confira também a caixa das letras no nome do arquivo. Em Linux, `chapter.md` e `CHAPTER.md` são nomes distintos.

## Escolher o arquivo certo

Abra o TOML do livro que você quer editar. No repositório do framework, a raiz contém o exemplo **Meu primeiro ebook**. A pasta `manual/` contém outro projeto com ficha própria. Dentro de qualquer capítulo, `ebookfy info` mostra a obra encontrada.

Guarde os dados da edição no `ebook.toml`. O compilador trata o frontmatter YAML de um `CHAPTER.md` como texto e publica seu conteúdo no corpo do livro.

Para mudar a ordem de leitura, mova a tabela inteira de um capítulo no TOML. Para corrigir a legenda, abra o CHAPTER.md indicado por aquela tabela. Para trocar a capa digital, confira `files.cover`. Depois de editar, compile de novo para atualizar os arquivos de `output.directory`.

As preferências pessoais do terminal ficam em `~/.ebookfy/settings.json`. Consulte-as com `ebookfy config list`. A variável `EBOOKFY_HOME` permite usar outro perfil. Credenciais e chave pertencem ao perfil pessoal e ficam fora das pastas compartilhadas do livro.

## Guardar as notas de trabalho

Crie a pasta `notas/` na raiz do livro e deixe seus arquivos fora de `[[chapters]]`.

| Material | Onde guardar |
| --- | --- |
| Público, objetivo e escopo do livro | `notas/briefing.md` |
| Fontes consultadas e capturas | `notas/fontes.md` para as referências e `notas/fontes/` para as capturas |
| Plano dos capítulos | `notas/sumario.md` |
| Autoria e licenças de material de terceiros | `notas/atribuicoes.md` |
| Ajustes encontrados na leitura de prova | `notas/revisao.md` |
| Arquivos e formatos entregues | `notas/entrega.md` |
| Correspondência entre o manuscrito original e o livro | `notas/migracao.md` |

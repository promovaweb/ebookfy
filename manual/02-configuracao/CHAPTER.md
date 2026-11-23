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

Uma edição 1.1.0 do livro com slug oficina produz oficina-v1.1.0.epub quando EPUB está selecionado. Preserve o identificador ao corrigir o texto da mesma obra. Use uma nova versão para manter a edição anterior disponível.

## Uma ficha completa para adaptar

O exemplo usa os caminhos que já existem no starter kit. Você pode copiá-lo para uma cópia descartável do projeto, executar `ebookfy info --json` e comparar cada campo da resposta com a configuração.

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

A versão que `ebookfy --version` imprime identifica o aplicativo instalado. Já `book.version` identifica o manuscrito. Um livro com versão `1.0.0` pode ser compilado pelo CLI `0.1.1`. Para publicar uma revisão do conteúdo mantendo a edição anterior disponível, altere a versão do livro e confira os novos nomes em `ebookfy build --json`.

Escreva os caminhos em relação à pasta do TOML. Cada texto editorial precisa existir e ter um título de nível 1. A lista exige pelo menos um capítulo e um formato. A ficha rejeita campos desconhecidos, entradas de capítulo repetidas e a repetição do mesmo formato. Ao corrigir um caminho, confira também a caixa das letras no nome do arquivo. Em Linux, `chapter.md` e `CHAPTER.md` são nomes distintos.

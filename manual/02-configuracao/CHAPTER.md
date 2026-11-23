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

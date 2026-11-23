# Do projeto aos três arquivos

Abra a pasta do seu livro. É ali que o Ebookfy procura o ebook.toml. Para acompanhar este percurso, use uma cópia do starter kit. Você vai trocar o título de um livro de exemplo, conferir a ficha editorial e abrir a primeira edição.

Com Node.js 22 ou superior, instale o pacote do Ebookfy. O npm instala também o runtime Bun. A compilação dos três formatos usa Pandoc, WeasyPrint e o comando ebook-convert do Calibre. Confira as ferramentas no mesmo terminal que usará para compilar.

~~~bash
node --version
npm install -g @promovaweb/ebookfy
pandoc --version
weasyprint --version
ebook-convert --version
git init meu-livro
cd meu-livro
ebookfy init
ebookfy info
~~~

Abra ebook.toml e altere o campo title de [book]. Edite o primeiro parágrafo do arquivo indicado na primeira tabela [[chapters]]. Rode os comandos abaixo. O título na ficha deve acompanhar sua alteração. A compilação imprime o caminho de cada arquivo criado.

~~~bash
ebookfy info --json
ebookfy build
~~~

Abra o PDF na pasta indicada em [output]. Siga um item do sumário e veja onde começa o capítulo. Abra o EPUB em um leitor digital e aumente o corpo da letra. No MOBI, procure o mesmo trecho. Os três arquivos devem trazer o parágrafo que você acabou de editar.

## Transformar o exemplo no seu livro

Neste exercício, você vai criar o livro **Caderno da oficina** a partir do starter kit. Use `ebookfy init` dentro do seu repositório vazio. O comando obtém a edição v0.3.0 do starter kit pelo Git autenticado, preserva o diretório .git do projeto e instala o conteúdo do modelo, inclusive as 15 skills. Confira a ficha com `ebookfy info` e veja os arquivos novos com `git status --short`. Uma pasta vazia sem Git também aceita o comando. Se houver um README ou outro arquivo na pasta, o CLI informa o nome encontrado e encerra a operação.

Na ficha, escreva `title = "Caderno da oficina"`, `slug = "caderno-da-oficina"` e um identificador próprio em `identifier`. O título aparece na ficha e nos metadados. O slug entra no nome do arquivo. O identificador acompanha a obra no catálogo. Registre a autoria antes de gerar a capa para que o nome no desenho coincida com o nome que aparece no leitor digital.

Entre em `capitulos/01-primeiro-capitulo/` e edite a primeira linha de `CHAPTER.md` para `# Preparar a mesa da oficina`. Execute `ebookfy info` dessa mesma pasta. A ficha deve trazer o novo título do livro e o novo título de capítulo. O CLI procura o TOML mais próximo na árvore de diretórios e encerra a procura na raiz Git. Um projeto de livro dentro de outro pode, portanto, manter sua própria ficha.

Para uma primeira prova digital, selecione `formats = ["epub"]` em `[output]`. Execute `ebookfy build`. Com a versão inicial e a pasta de saída do template, o resultado na raiz será `ebook/caderno-da-oficina-v0.1.0.epub`. Reabra o arquivo no leitor depois de compilar. Alguns leitores importam uma cópia para a biblioteca e continuam mostrando a edição importada anteriormente.

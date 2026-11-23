# Do projeto aos três arquivos

Abra a pasta do seu livro. É ali que o Ebookfy procura o ebook.toml. Para acompanhar este percurso, use uma cópia do starter kit. Você vai trocar o título de um livro de exemplo, conferir a ficha editorial e abrir a primeira edição.

Com Node.js 22 ou superior, instale o pacote do Ebookfy. O npm instala também o runtime Bun. A compilação dos três formatos usa Pandoc, WeasyPrint e o comando ebook-convert do Calibre. Confira as ferramentas no mesmo terminal que usará para compilar.

~~~bash
node --version
npm install -g @promovaweb/ebookfy
pandoc --version
weasyprint --version
ebook-convert --version
gh repo clone promovaweb/ebookfy-starter-kit meu-livro
cd meu-livro
ebookfy info
~~~

Abra ebook.toml e altere o campo title de [book]. Edite o primeiro parágrafo do arquivo indicado na primeira tabela [[chapters]]. Rode os comandos abaixo. O título na ficha deve acompanhar sua alteração. A compilação imprime o caminho de cada arquivo criado.

~~~bash
ebookfy info --json
ebookfy build
~~~

Abra o PDF na pasta indicada em [output]. Siga um item do sumário e veja onde começa o capítulo. Abra o EPUB em um leitor digital e aumente o corpo da letra. No MOBI, procure o mesmo trecho. Os três arquivos devem trazer o parágrafo que você acabou de editar.

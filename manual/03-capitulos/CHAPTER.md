# Organizar texto e imagens

Crie capitulos/02-oficina/CHAPTER.md e escreva um título na primeira linha. Salve o diagrama dessa oficina em capitulos/02-oficina/imagens/oficina.png. No texto, indique a imagem pelo caminho relativo à pasta do capítulo.

~~~markdown
# Preparar a oficina

![Disposição das mesas da oficina](imagens/oficina.png)
~~~

Acrescente a tabela abaixo ao fim do TOML. Mover a tabela altera a ordem das páginas. Mover a pasta exige atualizar o caminho.

~~~toml
[[chapters]]
file = "capitulos/02-oficina/CHAPTER.md"
~~~

No prefácio, apresente o público e o percurso. Reserve os créditos para contribuições, imagens e licenças. Na seção de autoria, registre o nome e a contribuição de cada autor. O compilador abre o prefácio antes do primeiro capítulo e fecha a edição com os créditos e a autoria.

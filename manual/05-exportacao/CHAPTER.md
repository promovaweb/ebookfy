# Revisar os arquivos de leitura

O PDF usa o kit A4 da Promovaweb com Inter e Manrope, sumário e paginação. O EPUB usa texto reajustável e a capa indicada no TOML. Para gerar MOBI, o Ebookfy cria primeiro um EPUB temporário e o converte com o Calibre. Você pode selecionar apenas MOBI na configuração.

Use ebookfy build --json em automações. Leia data.arquivos somente quando o processo sair com sucesso. O compilador prepara os formatos numa pasta temporária e começa a mover os resultados depois de terminar as conversões. Recompilar com o mesmo slug e versão substitui os arquivos daquela edição.

Se faltar um programa, o erro traz seu nome. Se uma imagem sumir, confira a grafia e as maiúsculas do caminho no capítulo. Abra o PDF e verifique quebras e rodapé. No EPUB, navegue pelo índice e teste uma fonte maior. Abra também o MOBI e confira se os acentos, a capa e as legendas sobreviveram à conversão.

# Contribuindo com o Ebookfy

Converse com a equipe pelo [Discord](https://promovaweb.com/discord). Use Node.js para scripts e testes e Bun 1.4.4 ou superior para executar o aplicativo Termfy.

## Desenvolvimento

Execute `npm ci`, `npm run typecheck` e `npm test`. Use `npm start -- info` para consultar o próprio manual e `npm run manual` para gerar os três arquivos. Os testes usam Pandoc, WeasyPrint e Calibre. As fontes do manual ficam em `manual/`. A pasta `docs/` referencia os capítulos técnicos também embutidos no CLI.

Atualize a validação de `src/book/project.ts` e o capítulo de configuração juntos. O compilador usa o kit A4 de `print/`. Registre cada novo comando no registro do Termfy para expô-lo no help, OpenCLI e documentação embutida. Ao atualizar a lista de comandos, revise o apêndice de referência do manual.

## Publicação

Use a versão de `VERSION` no pacote, no lockfile, no TOML do manual e no changelog. Gere e abra PDF, EPUB e MOBI. Faça o commit, crie a tag e a GitHub Release privada. Na máquina autenticada da Promovaweb, execute `npm pack` no commit da tag e publique o tarball com `npm publish ./promovaweb-ebookfy-X.Y.Z.tgz --access public`. Confirme a versão com `npm view @promovaweb/ebookfy version`. O npm distribui o CLI compilado, o kit de impressão e a marca.

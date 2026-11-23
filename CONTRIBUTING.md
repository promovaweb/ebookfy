# Contribuindo com o Ebookfy

Este guia é para quem vai mexer no código, nas skills, no manual ou no livro de exemplo. O uso do CLI está no [README](README.md). O Ebookfy é um aplicativo [Termfy](https://github.com/promovaweb/termfy), derivado do [Termfy Starter Kit](https://github.com/promovaweb/termfy-starter-kit): Bun 1.4.4 ou superior executa o aplicativo, e Node.js roda scripts e testes.

## Antes de começar

Converse antes de abrir um pull request grande: pelo [Discord](https://promovaweb.com/discord) ou numa [issue](https://github.com/promovaweb/ebookfy/issues). Abra uma issue por mudança. O starter kit que o `init` copia vive em [promovaweb/ebookfy-starter-kit](https://github.com/promovaweb/ebookfy-starter-kit).

## Desenvolvimento

Execute `npm ci`, `npm run typecheck` e `npm test`. O teste `tests/ficha.test.mjs` cobre as mensagens da ficha, a recusa de imagens e o build reproduzível. Use `npm start -- info` para consultar o livro de exemplo da raiz e `npm run manual` para gerar os três formatos do manual em `manual/ebook/`. Os testes usam Pandoc, WeasyPrint e Calibre. As fontes do manual ficam em `manual/`. A pasta `docs/` referencia os capítulos técnicos também embutidos no CLI.

Atualize a validação de `src/book/project.ts` e o capítulo de configuração juntos. O compilador usa o kit A4 de `print/`. Registre cada novo comando no registro do Termfy para expô-lo no help, OpenCLI e documentação embutida. Ao atualizar a lista de comandos, revise o apêndice de referência do manual.

## Publicação

Use a versão de `VERSION` no pacote, no lockfile, no TOML do manual e no changelog. Gere e abra PDF, EPUB e MOBI. A pasta `manual/ebook/` guarda só os três arquivos da versão atual: remova os da versão anterior com `git rm` e anexe os novos à GitHub Release, onde as edições antigas continuam disponíveis. Faça o commit, crie a tag e a GitHub Release. Na máquina autenticada da Promovaweb, execute `npm pack` no commit da tag e publique o tarball com `npm publish ./promovaweb-ebookfy-X.Y.Z.tgz --access public`. Confirme a versão com `npm view @promovaweb/ebookfy version`. O npm distribui o CLI compilado, o kit de impressão e a marca.

## Manter as skills

As 15 skills ficam em `skills/ebookfy-NN-etapa/`, cada uma com `SKILL.md` e `references/`. O `SKILL.md` segue a mesma ordem de seções em todas as etapas: quando usar, antes de começar, procedimento, regras do Ebookfy, problemas frequentes, entrega, checklist e referências. Cada referência precisa funcionar sozinha, porque a skill pode ser instalada isolada.

Toda afirmação sobre o compilador deve ser conferida num build real antes de entrar numa skill. Quando o comportamento do CLI mudar, atualize no mesmo trabalho a skill da etapa, o capítulo do manual e o livro de exemplo. Rode `npm test` (o teste das skills confere a numeração, as checklists e as referências) e, no Hub, `npm run validar:skills-prohibited`. Depois do push, atualize o starter kit com `npx skills add` e publique uma nova tag dele.

## Conferir a documentação e as capturas

As páginas de produção em `manual/` alimentam o livro e o tópico `ebook` da documentação embutida. Rode `npm start -- --skill ebook` e confira as entradas na aba Docs com `npm start -- tui --tab docs`. As figuras da interface ficam em `manual/capitulos/07-terminal/imagens/`, ao lado do capítulo que as utiliza.

Rode `npm run capturas` na raiz para atualizar as figuras das abas Livro e Docs. O gerador abre a TUI do exemplo com um perfil temporário em `EBOOKFY_HOME` e usa tmux, a fonte DejaVu Sans Mono e Chromium. Se o navegador ainda não estiver instalado, rode `npx playwright-core install chromium`. Confira nos PNGs se o sumário do exemplo e o texto do guia estão legíveis. Depois do build, confira a página ilustrada no PDF e as imagens incorporadas no EPUB. Ao mudar a edição do próprio manual, atualize também a imagem de capa digital com o título e a versão correntes.

O livro de exemplo da raiz mostra duas páginas da própria edição: `capitulos/04-imagens-e-capa/imagens/capa-do-pdf.png` (página 1) e `capitulos/06-compilar-e-conferir/imagens/sumario-do-pdf.png` (página 2). Depois de mudar o texto do exemplo, compile, exporte as duas páginas com `pdftoppm -r 120 -f 1 -l 2 -png` e compile de novo até o sumário não mudar entre dois builds. Os arquivos de `ebook/` entram no commit, porque o README aponta para eles, e o exemplo é copiado para o starter kit sem a pasta `ebook/`.

## Licença

As contribuições entram sob a mesma licença do projeto, a [GNU AGPL 3.0](LICENSE). As fontes do kit de impressão mantêm a SIL Open Font License, com o texto em `print/fonts/`.

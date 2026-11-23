/** Painel inicial do livro, atualizado a partir da configuração do projeto. */
import { resolve } from "node:path";
import { resumo } from "../../book/project.ts";
import { scrollPanel, dim, keyValueTable } from "../components.ts";
import type { Screen } from "../screen.ts";

export const overviewScreen: Screen = {
  id: "overview",
  title: "Livro",
  icon: "overview",
  description: "Ficha editorial e ordem de leitura",
  watch: () => [resolve("ebook.toml")],
  actions: [
    {
      keys: ["r"],
      description: "recarregar",
      icon: "refresh",
      run: (ctx) => ctx.refresh(),
    },
  ],
  mount(ctx) {
    const painel = scrollPanel(ctx.renderer, ctx.theme, {
      title: "Ficha do ebook",
      flexGrow: 1,
      active: true,
    });
    try {
      const livro = resumo();
      painel.add(
        keyValueTable(ctx.renderer, ctx.theme, [
          ["Título", livro.title],
          ["Autoria", livro.authors.join(", ")],
          ["Editora", livro.publisher],
          ["Edição", livro.version],
          ["Idioma", livro.language],
          ["Formatos", livro.output.formats.join(", ")],
          ...livro.chapters.map((c, i): [string, string] => [
            String(i + 1),
            c.title,
          ]),
        ]),
      );
      ctx.status(livro.chapters.length + " capítulos");
    } catch (erro) {
      painel.add(dim(ctx.renderer, ctx.theme, String(erro)));
      ctx.status("Confira ebook.toml na raiz do projeto");
    }
    return painel;
  },
};

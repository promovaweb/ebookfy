/** Comandos do livro aberto na pasta atual. */
import { compilar } from "../../book/build.ts";
import { resumo } from "../../book/project.ts";
import type { Command } from "../registry.ts";

export const info: Command = {
  name: "info",
  description: "Consulte metadados, formatos e capítulos do ebook.",
  run() {
    const data = resumo();
    const text = [
      data.title,
      data.authors.join(", "),
      data.publisher + " · v" + data.version,
      data.description,
      data.output.formats.join(", "),
      ...data.chapters.map((c, i) => i + 1 + ". " + c.title),
    ].join("\n");
    return { data, text };
  },
};

export const build: Command = {
  name: "build",
  description: "Compile os formatos declarados em ebook.toml.",
  run() {
    const arquivos = compilar();
    return { data: { arquivos }, text: arquivos.join("\n") };
  },
};

/** Contrato editorial compartilhado pelo terminal, pelo painel e pelo compilador. */
import { readFileSync, realpathSync, statSync } from "node:fs";
import { basename, isAbsolute, relative, resolve, sep } from "node:path";
import { z } from "zod";

const texto = z.string().trim().min(1);
const formatos = z.enum(["pdf", "epub", "mobi"]);
const contrato = z
  .object({
    book: z
      .object({
        title: texto,
        subtitle: texto.optional(),
        description: texto,
        language: texto,
        authors: z.array(texto).min(1),
        publisher: texto,
        rights: texto,
        identifier: texto,
        version: texto.regex(/^\d+\.\d+\.\d+$/),
        date: z.iso.date(),
        slug: texto.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      })
      .strict(),
    files: z
      .object({
        cover: texto,
        logo: texto.optional(),
        preface: texto,
        credits: texto,
        author: texto,
      })
      .strict(),
    chapters: z.array(z.object({ file: texto }).strict()).min(1),
    output: z
      .object({ directory: texto, formats: z.array(formatos).min(1) })
      .strict(),
  })
  .strict();

/** Impede caminhos absolutos e saídas da pasta do projeto, inclusive por links existentes. */
export function local(root: string, value: string): string {
  const path = resolve(root, value);
  const rel = relative(root, path);
  if (isAbsolute(value) || !rel || rel === ".." || rel.startsWith(".." + sep)) {
    throw new Error("Caminho fora do projeto: " + value);
  }
  return path;
}

/** Abre e valida as fontes na ordem definida pelo TOML. */
export function projeto(root = process.cwd()) {
  root = realpathSync(root);
  const config = contrato.parse(
    Bun.TOML.parse(readFileSync(resolve(root, "ebook.toml"), "utf8")),
  );
  const { book, files, chapters, output } = config;
  const nomes = [
    files.preface,
    ...chapters.map((c) => c.file),
    files.credits,
    files.author,
  ];
  if (
    new Set(nomes).size !== nomes.length ||
    new Set(output.formats).size !== output.formats.length
  ) {
    throw new Error("Cada seção e formato deve aparecer uma vez.");
  }
  if (chapters.some((c) => basename(c.file) !== "CHAPTER.md"))
    throw new Error("Cada capítulo precisa de CHAPTER.md.");
  const arquivo = (nome: string) => {
    const path = realpathSync(local(root, nome));
    local(root, relative(root, path));
    if (!statSync(path).isFile()) throw new Error("Esperado arquivo: " + nome);
    return path;
  };
  const fontes = nomes.map(arquivo);
  if (new Set(fontes).size !== fontes.length)
    throw new Error("Duas seções apontam ao mesmo arquivo.");
  const capa = arquivo(files.cover);
  const logo = files.logo ? arquivo(files.logo) : capa;
  const titulos = fontes.map((path) => {
    const titulo = /^# (.+)$/m.exec(readFileSync(path, "utf8"))?.[1]?.trim();
    if (!titulo)
      throw new Error("Inclua um título de nível 1 em " + relative(root, path));
    return titulo;
  });
  local(root, output.directory);
  return { root, book, files, chapters, output, fontes, capa, logo, titulos };
}

/** Projeta os mesmos dados do livro nas saídas JSON, texto e TUI. */
export function resumo() {
  const { book, chapters, titulos, files, output } = projeto();
  return {
    ...book,
    files,
    output,
    chapters: chapters.map((c, i) => ({ ...c, title: titulos[i + 1]! })),
  };
}

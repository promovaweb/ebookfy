/** Converte Markdown com caminhos relativos por capítulo e publica a edição após as conversões. */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { error } from "../app/errors.ts";
import { imagensRecusadas, textoDasImagens } from "./imagens.ts";
import { local, projeto } from "./project.ts";

const kit = fileURLToPath(new URL("../../print/", import.meta.url));

/**
 * Data fixa para os conversores, em segundos desde 1970 (SOURCE_DATE_EPOCH).
 * Com ela, Pandoc e WeasyPrint gravam a data da edição em vez do relógio, e
 * dois builds da mesma versão geram PDF e EPUB idênticos. O Calibre ainda
 * grava horários e um identificador aleatório no MOBI.
 */
function dataDaEdicao(data: string): string {
  return String(Math.floor(Date.parse(data + "T00:00:00Z") / 1000));
}

/** Propaga erros dos conversores e imagens ausentes como falha da compilação. */
function converter(
  programa: string,
  args: string[],
  cwd: string,
  epoch: string,
) {
  const r = spawnSync(programa, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    env: {
      ...process.env,
      SOURCE_DATE_EPOCH: process.env.SOURCE_DATE_EPOCH || epoch,
    },
  });
  if (r.error || r.status !== 0)
    throw new Error(
      programa + ": " + (r.error?.message || r.stderr || r.stdout),
    );
}

export function compilar() {
  const { root, book, output, fontes, capa, logo } = projeto();
  const recusadas = imagensRecusadas(root, fontes);
  if (recusadas.length)
    throw error.config(textoDasImagens(recusadas), { imagens: recusadas });
  const destino = local(root, output.directory);
  let existente = destino;
  while (!existsSync(existente)) existente = dirname(existente);
  if (realpathSync(existente) !== existente)
    throw new Error("A saída precisa ficar em uma pasta local do projeto.");
  mkdirSync(destino, { recursive: true });
  const tmp = mkdtempSync(join(destino, ".edicao-"));
  const base = book.slug + "-v" + book.version;
  const arquivo = (ext: string) => join(tmp, base + "." + ext);
  const epoch = dataDaEdicao(book.date);
  try {
    const meta = join(tmp, "metadata.json");
    writeFileSync(
      meta,
      JSON.stringify({
        ...book,
        lang: book.language,
        author: book.authors,
        logo: pathToFileURL(logo).href,
        tagline: book.subtitle,
        brand_name: book.publisher,
        "toc-title": "Sumário",
      }),
    );
    const args = [
      "--from=markdown+rebase_relative_paths-yaml_metadata_block",
      "--toc",
      "--fail-if-warnings",
      "--metadata-file",
      meta,
      ...fontes.map((f) => relative(root, f)),
    ];
    if (output.formats.includes("pdf")) {
      converter(
        "pandoc",
        [
          ...args,
          "--standalone",
          "--embed-resources",
          "--to=html5",
          // Sem quebra automática: o título entra numa string CSS do rodapé, que não aceita quebra de linha.
          "--wrap=none",
          // Notas viram spans no lugar da chamada para o WeasyPrint pô-las no pé da página.
          "--lua-filter",
          resolve(kit, "notas.lua"),
          "--template",
          resolve(kit, "template.html"),
          "--css",
          pathToFileURL(resolve(kit, "pdf.css")).href,
          "-o",
          arquivo("html"),
        ],
        root,
        epoch,
      );
      // O HTML temporário fica na saída. A base do WeasyPrint aponta para as imagens do projeto.
      converter(
        "weasyprint",
        ["--base-url", root + "/", arquivo("html"), arquivo("pdf")],
        root,
        epoch,
      );
    }
    if (output.formats.some((f) => f === "mobi" || f === "epub")) {
      converter(
        "pandoc",
        [
          ...args,
          "--to=epub3",
          "--epub-cover-image",
          capa,
          "-o",
          arquivo("epub"),
        ],
        root,
        epoch,
      );
    }
    if (output.formats.includes("mobi"))
      converter(
        "ebook-convert",
        [
          arquivo("epub"),
          arquivo("mobi"),
          "--timestamp",
          book.date,
          "--pubdate",
          book.date,
        ],
        root,
        epoch,
      );
    return output.formats.map((ext) => {
      const path = join(destino, base + "." + ext);
      renameSync(arquivo(ext), path);
      return relative(root, path);
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

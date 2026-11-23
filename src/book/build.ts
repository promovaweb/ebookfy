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
import { local, projeto } from "./project.ts";

const kit = fileURLToPath(new URL("../../print/", import.meta.url));

/** Propaga erros dos conversores e imagens ausentes como falha da compilação. */
function converter(programa: string, args: string[], cwd: string) {
  const r = spawnSync(programa, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (r.error || r.status !== 0)
    throw new Error(
      programa + ": " + (r.error?.message || r.stderr || r.stdout),
    );
}

export function compilar() {
  const { root, book, output, fontes, capa, logo } = projeto();
  const destino = local(root, output.directory);
  let existente = destino;
  while (!existsSync(existente)) existente = dirname(existente);
  if (realpathSync(existente) !== existente)
    throw new Error("A saída precisa ficar em uma pasta local do projeto.");
  mkdirSync(destino, { recursive: true });
  const tmp = mkdtempSync(join(destino, ".edicao-"));
  const base = book.slug + "-v" + book.version;
  const arquivo = (ext: string) => join(tmp, base + "." + ext);
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
          "--template",
          resolve(kit, "template.html"),
          "--css",
          pathToFileURL(resolve(kit, "pdf.css")).href,
          "-o",
          arquivo("html"),
        ],
        root,
      );
      // O HTML temporário fica na saída. A base do WeasyPrint aponta para as imagens do projeto.
      converter(
        "weasyprint",
        ["--base-url", root + "/", arquivo("html"), arquivo("pdf")],
        root,
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
      );
    }
    if (output.formats.includes("mobi"))
      converter("ebook-convert", [arquivo("epub"), arquivo("mobi")], root);
    return output.formats.map((ext) => {
      const path = join(destino, base + "." + ext);
      renameSync(arquivo(ext), path);
      return relative(root, path);
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

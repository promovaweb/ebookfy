/** Contrato editorial compartilhado pelo terminal, pelo painel e pelo compilador. */
import {
  closeSync,
  openSync,
  readSync,
  existsSync,
  readFileSync,
  realpathSync,
  statSync,
} from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path";
import { error } from "../app/errors.ts";
import { z } from "zod";
import { problemasDaFicha, textoDosProblemas } from "./problemas.ts";

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
    throw error.config("Caminho fora do livro: " + value + ". Use um caminho relativo dentro da pasta do ebook.toml.");
  }
  return path;
}

/** Procura a ficha mais próxima sem atravessar a raiz de um repositório Git. */
export function localizarLivro(inicio = process.cwd()): string | undefined {
  let pasta = realpathSync(inicio);
  while (true) {
    if (existsSync(resolve(pasta, "ebook.toml"))) return pasta;
    const acima = dirname(pasta);
    if (acima === pasta || existsSync(resolve(pasta, ".git"))) return undefined;
    pasta = acima;
  }
}

/** Remove o bloco de atributos do Pandoc (`{#id .classe}`) que pode fechar um título. */
function semAtributos(titulo: string): string {
  return titulo.replace(/\s*\{[^{}]*\}\s*$/, "").trim();
}

/** Lê somente o início de capítulos com título simples. Nos demais, interpreta o Markdown. */
function tituloDaSecao(path: string, root: string): string {
  return semAtributos(tituloBruto(path, root));
}

/** Devolve o primeiro título de nível 1 como escrito no arquivo. */
function tituloBruto(path: string, root: string): string {
  const fd = openSync(path, "r");
  try {
    const inicio = Buffer.alloc(1024);
    const lidos = readSync(fd, inicio, 0, inicio.length, 0);
    const primeira = /^# ([\p{L}\p{M}\p{N} ,.:;!?()/-]+)\r?\n/u.exec(
      inicio.toString("utf8", 0, lidos),
    );
    if (primeira?.[1]?.trim()) return primeira[1].trim();

    let titulo = "";
    Bun.markdown.render(readFileSync(fd, "utf8"), {
      heading(conteudo, { level }) {
        if (level === 1 && !titulo) titulo = conteudo.trim();
        return "";
      },
    });
    if (!titulo)
      throw error.config("Inclua um título de nível 1 (# Título) em " + relative(root, path) + ".");
    return titulo;
  } finally {
    closeSync(fd);
  }
}

/**
 * Lê e valida o ebook.toml. Erros de sintaxe e de contrato viram AppError de
 * configuração, com uma frase em português por problema e a lista em details.
 */
function lerFicha(root: string) {
  let bruto: unknown;
  try {
    bruto = Bun.TOML.parse(readFileSync(resolve(root, "ebook.toml"), "utf8"));
  } catch (falha) {
    const motivo = falha instanceof Error ? falha.message : String(falha);
    throw error.config("O ebook.toml não é um TOML válido: " + motivo);
  }
  const lido = contrato.safeParse(bruto);
  if (!lido.success) {
    const problemas = problemasDaFicha(lido.error);
    throw error.config(textoDosProblemas(problemas), { problemas });
  }
  return lido.data;
}

/** Abre e valida as fontes na ordem definida pelo TOML. */
export function projeto(inicio = process.cwd()) {
  const root = localizarLivro(inicio);
  if (!root)
    throw error.notFound(
      "Abra a pasta do livro ou uma de suas subpastas. Nenhum ebook.toml foi encontrado.",
    );
  const config = lerFicha(root);
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
    throw error.config(
      "Cada capítulo, texto editorial e formato deve aparecer uma vez no ebook.toml.",
    );
  }
  if (chapters.some((c) => basename(c.file) !== "CHAPTER.md"))
    throw error.config(
      "Cada capítulo de [[chapters]] precisa apontar para um arquivo CHAPTER.md.",
    );
  const arquivo = (nome: string) => {
    const declarado = local(root, nome);
    if (!existsSync(declarado))
      throw error.config("Arquivo não encontrado: " + nome + ". Confira o caminho no ebook.toml.", {
        arquivo: nome,
      });
    const path = realpathSync(declarado);
    local(root, relative(root, path));
    if (!statSync(path).isFile())
      throw error.config("O caminho " + nome + " precisa ser um arquivo, não uma pasta.");
    return path;
  };
  const fontes = nomes.map(arquivo);
  if (new Set(fontes).size !== fontes.length)
    throw error.config("Duas seções do ebook.toml apontam para o mesmo arquivo.");
  const capa = arquivo(files.cover);
  const logo = files.logo ? arquivo(files.logo) : capa;
  const titulos = fontes.map((path) => tituloDaSecao(path, root));
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

/**
 * Confere as imagens citadas nos textos do livro antes da compilação.
 *
 * O Pandoc busca e incorpora qualquer imagem que conseguir abrir, inclusive
 * um endereço `https://` ou um arquivo fora da pasta do livro. A edição
 * passaria a depender da rede e de arquivos que não estão no repositório.
 * Esta conferência recusa os dois casos e aponta arquivo e linha.
 */
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

/** Uma imagem recusada, com o motivo. */
export interface ImagemRecusada {
  arquivo: string;
  linha: number;
  imagem: string;
  motivo: "remota" | "fora do livro";
}

/** `![alt](caminho "título"){atributos}` e `<img src="caminho">`. */
const padroes = [
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g,
  /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi,
];

/** Lista as imagens remotas ou fora da raiz do livro, ignorando blocos de código. */
export function imagensRecusadas(
  root: string,
  fontes: string[],
): ImagemRecusada[] {
  const recusadas: ImagemRecusada[] = [];
  for (const fonte of fontes) {
    const linhas = readFileSync(fonte, "utf8").split(/\r?\n/);
    let cerca: string | undefined;
    linhas.forEach((texto, i) => {
      const abertura = /^\s*(`{3,}|~{3,})/.exec(texto);
      if (abertura) {
        const marca = abertura[1]!;
        if (!cerca) cerca = marca;
        else if (marca[0] === cerca[0] && marca.length >= cerca.length)
          cerca = undefined;
        return;
      }
      if (cerca) return;
      // Código em linha (`![x](y)`) não é imagem.
      const semCodigo = texto.replace(/`[^`]*`/g, "");
      for (const padrao of padroes) {
        for (const achado of semCodigo.matchAll(padrao)) {
          const imagem = achado[1]!;
          const motivo = conferir(root, fonte, imagem);
          if (motivo)
            recusadas.push({
              arquivo: relative(root, fonte),
              linha: i + 1,
              imagem,
              motivo,
            });
        }
      }
    });
  }
  return recusadas;
}

/** Classifica um caminho de imagem; `undefined` quando ele é aceito. */
function conferir(
  root: string,
  fonte: string,
  imagem: string,
): ImagemRecusada["motivo"] | undefined {
  if (imagem.startsWith("data:")) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(imagem)) return "remota";
  if (isAbsolute(imagem)) return "fora do livro";
  let caminho = imagem;
  try {
    caminho = decodeURI(imagem);
  } catch {
    // Mantém o texto original quando o caminho não é um URI válido.
  }
  const rel = relative(root, resolve(dirname(fonte), caminho));
  if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel))
    return "fora do livro";
  return undefined;
}

/** Mensagem única para o terminal, com uma linha por imagem. */
export function textoDasImagens(recusadas: ImagemRecusada[]): string {
  const linhas = recusadas.map(
    (r) =>
      `- ${r.arquivo}:${r.linha} usa ${r.imagem} (${r.motivo === "remota" ? "endereço remoto" : "fora da pasta do livro"}).`,
  );
  return [
    "Copie as imagens para a pasta imagens/ do capítulo e use o caminho relativo:",
    ...linhas,
  ].join("\n");
}

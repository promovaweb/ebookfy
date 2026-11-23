/**
 * Traduz as falhas de validação da ficha (`ebook.toml`) em frases curtas em
 * português, uma por problema. O `zod` devolve uma lista técnica, com `code`
 * e `path`; quem escreve um livro precisa saber qual campo corrigir e como.
 */
import type { z } from "zod";

/** Um problema da ficha, pronto para texto e para `--json`. */
export interface Problema {
  /** Campo afetado em notação de ponto, como `book.version` ou `chapters[2].file`. */
  campo: string;
  /** Frase em português com o que corrigir. */
  mensagem: string;
  /** Código original do zod, mantido para scripts e agentes. */
  codigo: string;
}

/** Converte o `path` do zod em `book.authors` ou `chapters[2].file`, com índices a partir de 1. */
export function nomeDoCampo(path: ReadonlyArray<PropertyKey>): string {
  let nome = "";
  for (const parte of path) {
    if (typeof parte === "number") nome += `[${parte + 1}]`;
    else nome += (nome ? "." : "") + String(parte);
  }
  return nome;
}

/** Nome da tabela TOML onde ficam as chaves de um `path`. */
function nomeDaTabela(path: ReadonlyArray<PropertyKey>): string {
  if (path.length === 0) return "A ficha";
  if (path[0] === "chapters" && typeof path[1] === "number")
    return `O capítulo ${path[1] + 1} em [[chapters]]`;
  return `A tabela [${nomeDoCampo(path)}]`;
}

const tipos: Record<string, string> = {
  string: "um texto entre aspas",
  array: "uma lista entre colchetes",
  object: "uma tabela",
  number: "um número",
  boolean: "true ou false",
};

/** Dica de formato para os campos com padrão fixo. */
function formatoEsperado(campo: string): string {
  if (campo === "book.version") return "use três números, como \"0.1.0\"";
  if (campo === "book.date") return "use AAAA-MM-DD, como \"2026-11-23\"";
  if (campo === "book.slug")
    return "use letras minúsculas, números e hífens, como \"meu-livro\"";
  return "confira o formato do valor";
}

/** Frase de um único problema. */
function frase(issue: z.core.$ZodIssue): string {
  const campo = nomeDoCampo(issue.path);
  const rotulo = "`" + campo + "`";
  switch (issue.code) {
    case "unrecognized_keys": {
      const chaves = issue.keys.map((k) => `"${k}"`).join(", ");
      const plural = issue.keys.length > 1;
      return `${nomeDaTabela(issue.path)} não aceita ${plural ? "as chaves" : "a chave"} ${chaves}. Confira a grafia ou remova.`;
    }
    case "invalid_type": {
      const esperado = tipos[issue.expected] ?? issue.expected;
      if (/received undefined/.test(issue.message))
        return `Falta ${rotulo}: informe ${esperado}.`;
      return `${rotulo} precisa ser ${esperado}.`;
    }
    case "too_small":
      return issue.origin === "array"
        ? `${rotulo} precisa de pelo menos um item.`
        : `${rotulo} está vazio.`;
    case "invalid_format":
      return `${rotulo} está em formato inválido: ${formatoEsperado(campo)}.`;
    case "invalid_value": {
      const valores = issue.values.map(String);
      const lista =
        valores.length > 1
          ? valores.slice(0, -1).join(", ") + " ou " + valores.at(-1)
          : valores.join("");
      return `${rotulo} aceita só ${lista}.`;
    }
    default:
      return `${rotulo}: ${issue.message}`;
  }
}

/** Lista os problemas na ordem em que o zod os encontrou. */
export function problemasDaFicha(erro: z.ZodError): Problema[] {
  return erro.issues.map((issue) => ({
    campo: nomeDoCampo(issue.path),
    mensagem: frase(issue),
    codigo: issue.code,
  }));
}

/** Texto único para o terminal: uma linha de abertura e um item por problema. */
export function textoDosProblemas(problemas: Problema[]): string {
  const total = problemas.length;
  const abertura =
    total === 1
      ? "A ficha ebook.toml tem 1 problema:"
      : `A ficha ebook.toml tem ${total} problemas:`;
  return [abertura, ...problemas.map((p) => "- " + p.mensagem)].join("\n");
}

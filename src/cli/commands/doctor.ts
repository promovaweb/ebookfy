/** Read-only environment diagnostics shared by CLI and MCP. */
import { statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { localizarLivro } from "../../book/project.ts";
import { manifest } from "../../app/manifest.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import { paths } from "../../config/paths.ts";
import { getMasterKey, masterKeySource } from "../../config/crypto.ts";
import { readVault } from "../../config/credentials.ts";
import type { Command } from "../registry.ts";

export interface DoctorCheck {
  name: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

/** Lê output.formats do livro alcançável a partir da pasta atual; sem livro ou com ficha ilegível, devolve lista vazia. */
function formatosDeclarados(): string[] {
  const raiz = localizarLivro();
  if (!raiz) return [];
  try {
    const ficha = Bun.TOML.parse(readFileSync(join(raiz, "ebook.toml"), "utf8"));
    const saida = "output" in ficha ? ficha.output : undefined;
    if (saida && typeof saida === "object" && "formats" in saida && Array.isArray(saida.formats))
      return saida.formats.filter((formato): formato is string => typeof formato === "string");
  } catch {
    // A ficha ilegível não impede a verificação do ambiente.
  }
  return [];
}

/** Confere pandoc, weasyprint e ebook-convert no PATH. Ausência gera aviso com os formatos afetados, nunca falha. */
function verificarConversores(): DoctorCheck[] {
  const declarados = formatosDeclarados();
  const conversores = {
    pandoc: ["pdf", "epub", "mobi"],
    weasyprint: ["pdf"],
    "ebook-convert": ["mobi"],
  };
  return Object.entries(conversores).map(([name, formatos]) => {
    const caminho = Bun.which(name);
    if (!caminho) {
      const afetados = declarados.filter((formato) => formatos.includes(formato));
      let detail = `Ausente do PATH. Exportação indisponível: ${formatos.join(", ")}.`;
      if (afetados.length) detail += ` Formatos afetados neste livro: ${afetados.join(", ")}.`;
      return { name, status: "warn", detail };
    }
    const resultado = spawnSync(caminho, ["--version"], { encoding: "utf8", timeout: 5000 });
    const versao = (resultado.stdout?.trim() || resultado.stderr?.trim() || "").split(/\r?\n/)[0];
    if (resultado.status === 0 && versao) return { name, status: "ok", detail: versao };
    return { name, status: "warn", detail: "Encontrado no PATH, mas não foi possível consultar a versão." };
  });
}

/**
 * Confere o epubcheck, validador oficial do EPUB (W3C). É opcional: sem ele o
 * build funciona, mas problemas que leitores digitais e lojas rejeitam podem
 * passar pela leitura visual. Ausência gera aviso com o comando para validar.
 */
function verificarEpubcheck(): DoctorCheck {
  const caminho = Bun.which("epubcheck");
  if (!caminho)
    return {
      name: "epubcheck",
      status: "warn",
      detail:
        "Opcional, ausente do PATH. Instale para validar o EPUB antes de distribuir: epubcheck ebook/<arquivo>.epub.",
    };
  const resultado = spawnSync(caminho, ["--version"], { encoding: "utf8", timeout: 15000 });
  const versao = (resultado.stdout?.trim() || resultado.stderr?.trim() || "").split(/\r?\n/)[0];
  return versao
    ? { name: "epubcheck", status: "ok", detail: versao }
    : { name: "epubcheck", status: "warn", detail: "Encontrado no PATH, mas não foi possível consultar a versão." };
}

/** Collects independent checks without writing files or exposing secrets. */
export function collectDoctorChecks(runtime = { version: Bun.version, stdin: Boolean(process.stdin.isTTY), stdout: Boolean(process.stdout.isTTY) }) {
  const checks: DoctorCheck[] = [];
  const add = (name: string, status: DoctorCheck["status"], detail: string) => checks.push({ name, status, detail });
  add("bun", Bun.semver.satisfies(runtime.version, ">=1.4.4") ? "ok" : "fail", `${runtime.version}; minimum 1.4.4`);
  for (const stream of ["stdin", "stdout"] as const) add(stream, runtime[stream] ? "ok" : "warn", runtime[stream] ? "TTY available" : "Not a TTY");
  const inspect = (name: string, path: string, check: () => void, detail: string) => {
    try {
      statSync(path);
    } catch (e) {
      add(name, (e as NodeJS.ErrnoException).code === "ENOENT" ? "warn" : "fail", (e as NodeJS.ErrnoException).code === "ENOENT" ? "Not created" : "Cannot access file");
      return;
    }
    try { check(); add(name, "ok", detail); }
    catch { add(name, "fail", "Unreadable, invalid or incorrectly configured"); }
  };
  inspect("directory", paths.base(), () => {
    const stat = statSync(paths.base());
    if (!stat.isDirectory() || (stat.mode & 0o777) !== 0o700) throw new Error("Invalid directory mode");
  }, "Directory exists; mode 0700");
  inspect("settings", paths.settings(), () => {
    const data: unknown = JSON.parse(readFileSync(paths.settings(), "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Expected object");
  }, "Readable JSON object");
  const source = masterKeySource();
  try {
    if (source !== "none") getMasterKey(false);
    add("master-key", source === "none" ? "warn" : "ok", source);
  } catch { add("master-key", "fail", `${source}; unavailable or invalid`); }
  inspect("credentials", paths.credentials(), () => { readVault(); }, "Vault decrypted successfully");
  add("binary", "ok", `${manifest.bin} ${manifest.version}`);
  add("platform", "ok", `${process.platform}-${process.arch}`);
  checks.push(...verificarConversores(), verificarEpubcheck());
  return { checks, ok: checks.every((check) => check.status !== "fail") };
}

export const doctorCommand: Command = {
  name: "doctor",
  description: "Confere runtime, terminal, perfil, chave, cofre, conversores de exportação e o epubcheck opcional.",
  exitCodes: [ExitCode.CONFIG],
  run: () => {
    const data = collectDoctorChecks();
    const marks = { ok: "✓", warn: "!", fail: "✗" };
    return { data, text: data.checks.map((c) => `${marks[c.status]} ${c.name}: ${c.detail}`).join("\n"), code: data.ok ? ExitCode.SUCCESS : ExitCode.CONFIG };
  },
};

/** Prepara a pasta atual com uma edição conhecida do starter kit privado. */
import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { error } from "../../app/errors.ts";
import { ExitCode } from "../../app/exit-codes.ts";
import type { Command } from "../registry.ts";

const repositorio = "https://github.com/promovaweb/ebookfy-starter-kit.git";
const versao = "v0.3.1";
const reserva = ".ebookfy-init";

/** Aceita a pasta .git e o arquivo .git utilizado por worktrees e submódulos. */
function conferirDestino(destino: string, duranteCopia = false) {
  const ocupado = readdirSync(destino).find(
    (nome) => nome !== ".git" && !(duranteCopia && nome === reserva),
  );
  if (ocupado)
    throw error.usage(
      "Execute ebookfy init em uma pasta vazia. Entrada encontrada: " + ocupado,
    );
}

export const init: Command = {
  name: "init",
  description:
    "Inicia um livro na pasta atual usando o starter kit privado da Promovaweb.",
  examples: ["ebookfy init", "ebookfy init --json"],
  exitCodes: [ExitCode.NOT_FOUND, ExitCode.NETWORK_OR_API],
  run() {
    const destino = process.cwd();
    conferirDestino(destino);
    const temporaria = join(destino, reserva);
    // A criação exclusiva também serializa duas inicializações no mesmo diretório.
    mkdirSync(temporaria);
    const modelo = join(temporaria, "modelo");
    const instalados: string[] = [];
    try {
      const git = spawnSync(
        "git",
        [
          "clone",
          "--quiet",
          "--depth",
          "1",
          "--branch",
          versao,
          repositorio,
          modelo,
        ],
        { encoding: "utf8", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } },
      );
      if ((git.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT")
        throw error.notFound("Instale o Git e execute ebookfy init novamente.");
      if (git.error || git.status !== 0) {
        throw error.network(
          "Falha ao obter o starter kit privado. Confira sua conexão e o acesso com git ls-remote " +
            repositorio,
        );
      }

      conferirDestino(destino, true);
      for (const nome of readdirSync(modelo)) {
        if (nome === ".git") continue;
        renameSync(join(modelo, nome), join(destino, nome));
        instalados.push(nome);
      }
      const data = {
        diretorio: destino,
        template: repositorio,
        versao,
        entradas: instalados,
      };
      return {
        data,
        text:
          "Livro iniciado em " +
          destino +
          "\nEdite ebook.toml, confira a ficha com ebookfy info e exporte com ebookfy build.",
      };
    } catch (falha) {
      for (const nome of instalados.reverse())
        renameSync(join(destino, nome), join(modelo, nome));
      throw falha;
    } finally {
      rmSync(temporaria, { recursive: true, force: true });
    }
  },
};

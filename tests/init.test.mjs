/** Exercita o comando pelo CLI usando um remoto Git de teste, inclusive na falha de clone. */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

test("init conserva o repositório de destino, instala arquivos ocultos e permite repetir após falha", (t) => {
  const base = mkdtempSync(join(tmpdir(), "ebookfy-init-"));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const destino = join(base, "meu livro");
  const modelo = join(base, "modelo");
  const oficial = "https://github.com/promovaweb/ebookfy-starter-kit.git";
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: join(base, "gitconfig"),
    GIT_CONFIG_NOSYSTEM: "1",
  };
  const git = (cwd, ...args) =>
    execFileSync("git", args, { cwd, env, encoding: "utf8" });
  git(
    base,
    "config",
    "--global",
    "url." + pathToFileURL(modelo).href + ".insteadOf",
    oficial,
  );
  git(base, "init", "-q", destino);
  git(destino, "remote", "add", "origin", "https://example.org/meu-livro.git");
  const executar = () => {
    const r = spawnSync(
      "bun",
      [
        fileURLToPath(new URL("../src/main.ts", import.meta.url)),
        "init",
        "--json",
      ],
      { cwd: destino, env, encoding: "utf8" },
    );
    return JSON.parse(r.stdout);
  };
  assert.equal(executar().ok, false);
  assert.deepEqual(readdirSync(destino), [".git"]);
  git(base, "init", "-q", modelo);
  mkdirSync(join(modelo, ".agents"));
  writeFileSync(join(modelo, ".agents", "exemplo"), "skill");
  writeFileSync(join(modelo, "ebook.toml"), "[book]\n");
  git(modelo, "add", ".");
  git(
    modelo,
    "-c",
    "user.name=Teste",
    "-c",
    "user.email=teste@example.org",
    "-c",
    "commit.gpgsign=false",
    "commit",
    "-qm",
    "modelo",
  );
  git(modelo, "tag", "v0.3.1");
  writeFileSync(join(destino, ".gitignore"), "rascunho");
  assert.equal(executar().error.name, "USAGE");
  assert.equal(readFileSync(join(destino, ".gitignore"), "utf8"), "rascunho");
  rmSync(join(destino, ".gitignore"));
  const resultado = executar();
  assert.equal(resultado.ok, true);
  assert.equal(resultado.data.versao, "v0.3.1");
  assert.equal(
    readFileSync(join(destino, ".agents", "exemplo"), "utf8"),
    "skill",
  );
  assert.equal(
    git(destino, "remote", "get-url", "origin").trim(),
    "https://example.org/meu-livro.git",
  );
  assert.equal(executar().error.name, "USAGE");
});

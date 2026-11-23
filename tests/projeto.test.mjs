/** Testa a experiência pelo executável com uma cópia isolada das fontes da edição. */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const raiz = new URL("../", import.meta.url);
const cli = new URL("src/main.ts", raiz).pathname;

test("ficha, formatos selecionados e diagnóstico de capítulo ausente", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "ebookfy-teste-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  for (const nome of ["manual", "editorial", "brand", "ebook.toml"]) {
    cpSync(new URL(nome, raiz), join(cwd, nome), { recursive: true });
  }
  const rodar = (...args) =>
    JSON.parse(
      execFileSync("bun", [cli, ...args, "--json"], { cwd, encoding: "utf8" }),
    ).data;
  const info = rodar("info");
  assert.equal(info.title, "Manual do Ebookfy");
  assert.equal(
    info.version,
    readFileSync(new URL("VERSION", raiz), "utf8").trim(),
  );
  assert.equal(
    info.version,
    JSON.parse(readFileSync(new URL("package.json", raiz))).version,
  );
  const toml = join(cwd, "ebook.toml");
  const fonte = readFileSync(toml, "utf8");
  writeFileSync(toml, fonte.replace('["pdf", "epub", "mobi"]', '["mobi"]'));
  const { arquivos } = rodar("build");
  assert.deepEqual(arquivos, [
    "ebook/manual-ebookfy-v" + info.version + ".mobi",
  ]);
  assert.equal(
    readFileSync(join(cwd, arquivos[0])).toString("ascii", 60, 68),
    "BOOKMOBI",
  );
  writeFileSync(
    toml,
    fonte.replace(info.chapters[0].file, "ausente/CHAPTER.md"),
  );
  const erro = spawnSync("bun", [cli, "info", "--json"], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(erro.status, 0);
  assert.equal(JSON.parse(erro.stdout).ok, false);
});

test("consulta a ficha dentro do capítulo e isola livros e repositórios vizinhos", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "ebookfy-subpasta-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  for (const nome of ["manual", "editorial", "brand", "ebook.toml"]) {
    cpSync(new URL(nome, raiz), join(cwd, nome), { recursive: true });
  }
  const pasta = join(cwd, "manual", "01-primeira-edicao");
  writeFileSync(
    join(pasta, "CHAPTER.md"),
    "~~~bash\n# Comentário\n~~~\n\n# **Título** do capítulo ###\n",
  );
  const consultar = () =>
    spawnSync("bun", [cli, "info", "--json"], { cwd: pasta, encoding: "utf8" });
  const livro = consultar();
  assert.equal(livro.status, 0, livro.stdout);
  assert.equal(
    JSON.parse(livro.stdout).data.chapters[0].title,
    "Título do capítulo",
  );
  writeFileSync(join(pasta, ".git"), "gitdir: exemplo");
  const semLivro = consultar();
  assert.equal(JSON.parse(semLivro.stdout).error.name, "NOT_FOUND");
});

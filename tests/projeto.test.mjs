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
  for (const nome of ["capitulos", "editorial", "brand", "ebook.toml"]) {
    cpSync(new URL(nome, raiz), join(cwd, nome), { recursive: true });
  }
  const rodar = (...args) =>
    JSON.parse(
      execFileSync("bun", [cli, ...args, "--json"], { cwd, encoding: "utf8" }),
    ).data;
  const info = rodar("info");
  assert.equal(info.title, "Meu primeiro ebook");
  assert.equal(info.version, "0.1.0");
  const toml = join(cwd, "ebook.toml");
  const fonte = readFileSync(toml, "utf8");
  writeFileSync(toml, fonte.replace('["pdf", "epub", "mobi"]', '["mobi"]'));
  const { arquivos } = rodar("build");
  assert.deepEqual(arquivos, [
    "ebook/primeiro-ebook-v" + info.version + ".mobi",
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
  for (const nome of ["capitulos", "editorial", "brand", "ebook.toml"]) {
    cpSync(new URL(nome, raiz), join(cwd, nome), { recursive: true });
  }
  const pasta = join(cwd, "capitulos", "01-primeiro-capitulo");
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

/**
 * Testa as conferências da ficha e das fontes antes da compilação: mensagens
 * legíveis para erros do ebook.toml, recusa de imagens remotas ou fora do
 * livro e build reproduzível pela data da edição.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
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

/** Copia o livro de exemplo para uma pasta temporária, só com EPUB. */
function copiarExemplo(t) {
  const cwd = mkdtempSync(join(tmpdir(), "ebookfy-ficha-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  for (const nome of ["capitulos", "editorial", "brand", "ebook.toml"])
    cpSync(new URL(nome, raiz), join(cwd, nome), { recursive: true });
  const toml = join(cwd, "ebook.toml");
  writeFileSync(
    toml,
    readFileSync(toml, "utf8").replace('["pdf", "epub", "mobi"]', '["epub"]'),
  );
  return cwd;
}

/** Executa o CLI com --json e devolve status e envelope. */
function rodar(cwd, ...args) {
  const r = spawnSync("bun", [cli, ...args, "--json"], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, SOURCE_DATE_EPOCH: "" },
  });
  return { status: r.status, saida: JSON.parse(r.stdout) };
}

test("erros da ficha saem em português, um por campo, com exit code 3", (t) => {
  const cwd = copiarExemplo(t);
  const toml = join(cwd, "ebook.toml");
  writeFileSync(
    toml,
    readFileSync(toml, "utf8")
      .replace("[book]", '[book]\nautor = "X"')
      .replace(/^version = .*$/m, 'version = "1.0"')
      .replace(/^cover = .*$/m, ""),
  );
  const { status, saida } = rodar(cwd, "info");
  assert.equal(status, 3);
  assert.equal(saida.error.name, "CONFIG");
  assert.match(saida.error.message, /^A ficha ebook.toml tem 3 problemas:/);
  const campos = saida.error.details.problemas.map((p) => p.campo).sort();
  assert.deepEqual(campos, ["book", "book.version", "files.cover"]);
  assert.match(saida.error.message, /A tabela \[book\] não aceita a chave "autor"/);
  assert.match(saida.error.message, /Falta `files.cover`/);
  assert.match(saida.error.message, /use três números/);

  writeFileSync(toml, "[book\n");
  const sintaxe = rodar(cwd, "info");
  assert.equal(sintaxe.status, 3);
  assert.match(sintaxe.saida.error.message, /não é um TOML válido/);
});

test("o build recusa imagem remota ou fora do livro e aceita código", (t) => {
  const cwd = copiarExemplo(t);
  const capitulo = join(cwd, "capitulos/02-planejar-o-livro/CHAPTER.md");
  appendFileSync(
    capitulo,
    "\n![Remota](https://example.com/a.png)\n\n![Fora](../../../fora.png)\n\n`![código](https://example.com/b.png)`\n",
  );
  const { status, saida } = rodar(cwd, "build");
  assert.equal(status, 3);
  const imagens = saida.error.details.imagens.map((i) => [i.imagem, i.motivo]);
  assert.deepEqual(imagens, [
    ["https://example.com/a.png", "remota"],
    ["../../../fora.png", "fora do livro"],
  ]);
});

test("dois builds da mesma edição geram o mesmo EPUB", (t) => {
  const cwd = copiarExemplo(t);
  const hash = () => {
    const { status, saida } = rodar(cwd, "build");
    assert.equal(status, 0, JSON.stringify(saida));
    return createHash("sha256")
      .update(readFileSync(join(cwd, saida.data.arquivos[0])))
      .digest("hex");
  };
  assert.equal(hash(), hash());
});

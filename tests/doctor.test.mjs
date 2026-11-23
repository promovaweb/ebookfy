import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../src/main.ts", import.meta.url));
const bun = execFileSync("bun", ["-e", "console.log(process.execPath)"], { encoding: "utf8" }).trim();
const conversores = ["pandoc", "weasyprint", "ebook-convert"];

function ambiente(t) {
  const base = mkdtempSync(join(tmpdir(), "ebookfy-doctor-"));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const bin = join(base, "bin");
  mkdirSync(bin);
  const env = { ...process.env, PATH: bin, EBOOKFY_HOME: join(base, "perfil") };
  const diagnosticar = () => JSON.parse(execFileSync(bun, [cli, "doctor", "--json"], {
    cwd: bin, env, encoding: "utf8",
  })).data;
  return { base, bin, diagnosticar };
}

test("doctor informa a primeira linha de versão dos três conversores fora de um livro", (t) => {
  const { bin, diagnosticar } = ambiente(t);
  for (const nome of conversores) {
    writeFileSync(join(bin, nome), `#!/bin/sh\n[ "$1" = "--version" ] || exit 1\necho "${nome} 1.2"\necho detalhes\n`, { mode: 0o755 });
  }
  const { checks, ok } = diagnosticar();
  assert.equal(ok, true);
  for (const name of conversores) {
    assert.deepEqual(checks.find((c) => c.name === name), { name, status: "ok", detail: name + " 1.2" });
  }
});

test("doctor avisa sobre conversores ausentes e destaca os formatos declarados pelo livro", (t) => {
  const { base, diagnosticar } = ambiente(t);
  writeFileSync(join(base, "ebook.toml"), '[output]\nformats = ["mobi"]\n');
  const { checks, ok } = diagnosticar();
  assert.equal(ok, true);
  for (const [i, formato] of ["pdf, epub, mobi", "pdf", "mobi"].entries()) {
    const check = checks.find((c) => c.name === conversores[i]);
    assert.equal(check.status, "warn");
    assert.ok(check.detail.includes("Ausente do PATH"));
    assert.ok(check.detail.includes("Exportação indisponível: " + formato + "."));
    assert.equal(check.detail.includes("neste livro: mobi"), i !== 1);
  }
});

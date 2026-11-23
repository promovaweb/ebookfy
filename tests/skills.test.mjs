/** Confere as referências portáteis instaladas junto de cada etapa editorial. */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

test("cada etapa numerada acompanha seu exemplo local e sua checklist", () => {
  const biblioteca = new URL("../skills/", import.meta.url);
  const nomes = readdirSync(biblioteca).sort();
  assert.equal(nomes.length, 15);
  for (const [indice, nome] of nomes.entries()) {
    assert.ok(nome.startsWith("ebookfy-" + String(indice + 1).padStart(2, "0") + "-"));
    const pasta = new URL(nome + "/", biblioteca);
    const instrucao = readFileSync(new URL("SKILL.md", pasta), "utf8");
    assert.ok(instrucao.includes("name: " + nome + "\n"));
    assert.match(instrucao, /^- \[ \] .+/m);
    const referencias = Array.from(instrucao.matchAll(/\]\((references\/[\w-]+\.md)\)/g), m => m[1]);
    assert.ok(referencias.length > 0, nome);
    for (const referencia of referencias) {
      assert.match(readFileSync(new URL(referencia, pasta), "utf8"), /^# .+\n/);
    }
  }
});

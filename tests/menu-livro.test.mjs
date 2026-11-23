/** Exercita a navegação do livro em um terminal simulado pelo runtime do CLI. */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

for (const width of [64, 108]) {
  test(`Menu do livro com teclado e mouse em ${width} colunas`, () => {
    const dir = mkdtempSync(join(tmpdir(), "ebookfy-menu-"));
    try {
      execFileSync("bun", ["-e", `
        import assert from "node:assert/strict";
        import { createTestRenderer } from "@opentui/core/testing";
        import { mountTui } from "./src/tui/index.ts";
        const t = await createTestRenderer({width: ${width}, height: 32});
        const closed = mountTui(t.renderer, {initialTab:"overview", motion:false});
        const frame = async () => { await t.renderOnce(); return t.captureCharFrame(); };
        const key = async name => { t.mockInput.pressKey(name); if (name === "ESCAPE") await Bun.sleep(80); return frame(); };
        try {
          const home = await frame();
          assert.match(home, /MENU DO LIVRO/);
          assert.equal(home.includes("SUMÁRIO"), ${width} >= 80);
          t.mockInput.pressArrow("down"); await frame();
          assert.match(await key("RETURN"), /CHAPTER.md/);
          assert.match(await key("ESCAPE"), /MENU DO LIVRO/);
          const rows = (await frame()).split("\\n");
          const y = rows.findIndex(row => row.includes("Arquivos de saída"));
          assert.ok(y >= 0);
          const row = rows[y];
          const x = Bun.stringWidth(row.slice(0, row.indexOf("Arquivos de saída")));
          await t.mockMouse.click(x, y);
          assert.match(await frame(), /primeiro-ebook-v.*pdf/);
          assert.match(await key("f"), /Editora/);
          await key("g");
          assert.match(await key("1"), /Editora/);
          assert.match(await key("ESCAPE"), /MENU DO LIVRO/);
        } finally { t.renderer.destroy(); await closed; }
      `], { env: { ...process.env, EBOOKFY_HOME: dir }, stdio: "pipe" });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}

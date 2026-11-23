/** Gera as figuras do manual e do livro de exemplo a partir das telas reais da TUI. */
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as esperar } from "node:timers/promises";
import { stripVTControlCharacters } from "node:util";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const raiz = resolve(import.meta.dirname, "..");
const imagens = join(raiz, "manual/capitulos/07-terminal/imagens");
const colunas = 120;
const linhas = 34;
const viewport = { width: 1200, height: 782 };
const perfil = await mkdtemp(join(tmpdir(), "ebookfy-capturas-"));
const env = { ...process.env, EBOOKFY_HOME: perfil, LC_ALL: "C.UTF-8" };

/** Usa um socket privado para que as sessões do usuário não afetem o resultado. */
function tmux(...args) {
  return execFileSync("tmux", ["-u", "-S", join(perfil, "socket"), "-f", "/dev/null", ...args], {
    cwd: raiz, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
}

/**
 * Aguarda dois quadros idênticos, incluindo cores, com o conteúdo esperado.
 * @param {string[]} trechos Textos que precisam estar visíveis na aba.
 * @returns {Promise<string>} Quadro ANSI completo, sem a quebra final do tmux.
 */
async function quadroEstavel(trechos) {
  let anterior;
  let faltam = trechos;
  const limite = Date.now() + 15000;
  do {
    const quadro = tmux("capture-pane", "-p", "-e", "-N", "-t", "captura");
    const texto = stripVTControlCharacters(quadro);
    faltam = trechos.filter(trecho => !texto.includes(trecho));
    if (!faltam.length && quadro === anterior) return quadro.replace(/\n$/, "");
    anterior = quadro;
    await esperar(250);
  } while (Date.now() < limite);
  throw new Error("A tela não estabilizou. Trechos ausentes: " + faltam.join(", "));
}

/**
 * Reproduz o quadro no xterm.js e ajusta sua grade às dimensões da figura.
 * @param {import("playwright-core").Browser} navegador
 * @param {string} quadro
 * @returns {Promise<Buffer>} PNG da tela.
 */
async function renderizar(navegador, quadro) {
  const pagina = await navegador.newPage({ viewport, deviceScaleFactor: 1 });
  try {
    await pagina.setContent('<style>body{margin:0}#terminal{width:max-content;transform-origin:top left}</style><div id="terminal"></div>');
    await pagina.addStyleTag({ path: fileURLToPath(import.meta.resolve("@xterm/xterm/css/xterm.css")) });
    await pagina.addScriptTag({ path: fileURLToPath(import.meta.resolve("@xterm/xterm")) });
    await pagina.evaluate(async ({ quadro, colunas, linhas }) => {
      const terminal = new Terminal({
        cols: colunas, rows: linhas, convertEol: true, scrollback: 0,
        fontFamily: '"DejaVu Sans Mono", monospace', fontSize: 16,
      });
      const painel = document.querySelector("#terminal");
      terminal.open(painel);
      await new Promise(resolve => terminal.write("\x1b[?25l" + quadro, resolve));
      const grade = painel.querySelector(".xterm-screen").getBoundingClientRect();
      painel.style.transform = `scale(${innerWidth / grade.width}, ${innerHeight / grade.height})`;
    }, { quadro, colunas, linhas });
    return await pagina.screenshot();
  } finally {
    await pagina.close();
  }
}

/** Fecha a TUI com q e aguarda a saída antes de reutilizar o nome da sessão. */
async function capturar(navegador, aba, trechos) {
  tmux("new-session", "-d", "-s", "captura", "-x", String(colunas), "-y", String(linhas),
    "bun", "src/main.ts", "tui", "--tab", aba);
  try {
    const quadro = await quadroEstavel(trechos);
    tmux("send-keys", "-t", "captura", "q");
    for (let i = 0; i < 50; i++) {
      try {
        tmux("has-session", "-t", "captura");
      } catch (erro) {
        if (erro.status === 1) return await renderizar(navegador, quadro);
        throw erro;
      }
      await esperar(100);
    }
    throw new Error("A TUI não encerrou após receber q.");
  } finally {
    // Recupera também uma sessão que falhou antes de aceitar teclas.
    try { tmux("kill-server"); } catch (erro) { if (erro.status !== 1) throw erro; }
  }
}

try {
  await writeFile(join(perfil, "settings.json"), JSON.stringify({ tui: { theme: "night", icons: "unicode" } }));
  const versao = (await readFile(join(raiz, "VERSION"), "utf8")).trim();
  const { data: livro } = JSON.parse(execFileSync("bun", ["src/main.ts", "info", "--json"], { cwd: raiz, env }));
  const navegador = await chromium.launch();
  try {
    const livroPng = await capturar(navegador, "overview", [`v${versao}`, livro.title, "SUMÁRIO", ...livro.chapters.map(c => c.title)]);
    const docsPng = await capturar(navegador, "docs", [`v${versao}`, "Produzir um ebook", "Abra a pasta do seu livro"]);
    await writeFile(join(imagens, "tui-livro.png"), livroPng);
    // O livro de exemplo mostra a mesma tela no capítulo sobre a ficha.
    await writeFile(join(raiz, "capitulos/01-primeiro-capitulo/imagens/tui-livro.png"), livroPng);
    await writeFile(join(imagens, "tui-docs.png"), docsPng);
  } finally {
    await navegador.close();
  }
} finally {
  await rm(perfil, { recursive: true, force: true });
}

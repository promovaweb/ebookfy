#!/usr/bin/env node
/** Inicia o aplicativo Termfy com o runtime da plataforma fornecido pelo npm. */
const { spawnSync } = require("node:child_process");
const { join } = require("node:path");

const windows = process.platform === "win32";
const sistema = windows ? "windows" : process.platform;
const arquitetura = process.arch === "arm64" ? "aarch64" : process.arch;
const musl = sistema === "linux" && !process.report.getReport().header.glibcVersionRuntime;
const pacote = "@oven/bun-" + sistema + "-" + arquitetura + (musl ? "-musl" : "");
let runtime = "bun";
try {
  runtime = require.resolve(pacote + "/bin/" + (windows ? "bun.exe" : "bun"));
} catch {
  // Quem instala sem dependências opcionais pode usar o Bun disponível no PATH.
}
const resultado = spawnSync(runtime, [join(__dirname, "../dist/bin/main.js"), ...process.argv.slice(2)], {stdio:"inherit"});
if (resultado.error) console.error("Falha ao iniciar o Bun: " + resultado.error.message);
if (resultado.signal) process.kill(process.pid, resultado.signal);
process.exitCode = resultado.status ?? 1;

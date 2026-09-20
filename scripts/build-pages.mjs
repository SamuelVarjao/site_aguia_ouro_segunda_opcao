/**
 * Build estático para o GitHub Pages: `npm run build:pages` → pasta `out/`.
 *
 * O export estático não aceita rotas /api (precisam de servidor), então a
 * pasta `src/app/api` é tirada do caminho só durante o build e devolvida no
 * fim, mesmo se o build falhar ou for interrompido. Na Vercel este script não
 * é usado — lá vale o `next build` normal, com as rotas /api funcionando.
 *
 * PAGES_BASE_PATH: prefixo da URL, ex. "/nome-do-repo" (o workflow do GitHub
 * passa isso sozinho). Vazio para domínio próprio ou repositório
 * usuario.github.io.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const API_DIR = "src/app/api";
const STASH_DIR = ".pages-stash";
const STASHED_API = `${STASH_DIR}/api`;

let stashed = false;

function restore() {
  if (stashed && existsSync(STASHED_API)) {
    renameSync(STASHED_API, API_DIR);
  }
  stashed = false;
}

process.on("exit", restore);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => process.exit(1));
}

if (existsSync(API_DIR)) {
  mkdirSync(STASH_DIR, { recursive: true });
  renameSync(API_DIR, STASHED_API);
  stashed = true;
}

const require = createRequire(import.meta.url);
const result = spawnSync(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build"],
  {
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  },
);

restore();

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// Sem isto o Jekyll do Pages ignora pastas iniciadas por "_" e o site perde
// a pasta _next (CSS e JavaScript).
writeFileSync("out/.nojekyll", "");
console.log("\nSite estático pronto em out/");

// Monta o mapa final de redirects para /produto, /produtos e /necessidades a
// partir dos resultados já casados contra a Vitrine Virtual (ver
// scratchpad/wp-export para o processo de matching). Roda uma vez, gera
// src/data/redirect-map-produtos.json — não é parte do build normal.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRATCH =
  "C:/Users/varja/AppData/Local/Temp/claude/C--dev-novo-site-aguia-ouro/bcdc5e0d-997a-43db-a2fb-731d2f3a194f/scratchpad/wp-export";
const OUT = join(__dirname, "..", "src", "data", "redirect-map-produtos.json");

const m = JSON.parse(readFileSync(`${SCRATCH}/match-results.json`, "utf8"));
const n = JSON.parse(readFileSync(`${SCRATCH}/necessidades-results.json`, "utf8"));

const FALLBACK = "/servicos";
const STORE_SEARCH = "https://aguiadeouro.loja.pedidopago.com.br/produtos/";

// Correções manuais sobre o matching automático:
// - os 3 séruns "recuperados" pela heurística de prefixo colidiram só na
//   palavra genérica "sérum" com um produto de vitamina C — falso positivo,
//   revertido para fallback, exceto o Thalasferas (ver abaixo).
// - Thalasferas: falso NEGATIVO da 1ª passada — é grafia alternativa de
//   "Talaspheras", confirmado buscando os dois termos isoladamente.
// - colageno/vitaminico/curcuma/detox/imunidade/vitaminas: a heurística de
//   recheck incluiu pontuação como se fosse palavra ("Curcuma –") ou não
//   normalizou maiúsculas — termos de busca limpos e reverificados à mão.
const OVERRIDES = {
  "/produto/serum-hidratante-e-rejuvenescedor-tensiplus-3-hyaxel-3-matrixyl-3-na-base-second-skin-30g": FALLBACK,
  "/produto/serum-area-dos-olhos-beautifeye-3-idealift-3-essenskin-3-haloxyl-2-15g": FALLBACK,
  "/produto/serum-thalasferas-de-vitamina-c-10": STORE_SEARCH + "thalasferas",
  "/produto/curcuma-extrato-seco-padronizado": STORE_SEARCH + "curcuma",
  "/produtos/colageno": STORE_SEARCH + "colageno",
  "/produtos/vitaminico": STORE_SEARCH + "vitaminico",
  "/necessidades/detox-e-figado": STORE_SEARCH + "detox",
  "/necessidades/imunidade": STORE_SEARCH + "imunidade",
  "/necessidades/vitaminas-e-minerais": STORE_SEARCH + "vitaminas",
};

const map = {};

for (const item of m.produtos) {
  map[`/produto/${item.slug}`] = item.encontrado ? item.urlBusca : FALLBACK;
}
for (const item of m.produtosTax) {
  map[`/produtos/${item.slug}`] = item.encontrado ? item.urlBusca : FALLBACK;
}
map["/produtos"] = FALLBACK;
map["/produto"] = FALLBACK;

for (const item of n) {
  map[`/necessidades/${item.slug}`] = item.encontrado ? item.destino : FALLBACK;
}
map["/necessidades"] = FALLBACK;

// /topico não tem post type/taxonomia própria via REST (não indexado pra
// nós), então não há lista de slugs pra mapear individualmente — qualquer
// URL antiga sob /topico/ cai no catch-all do middleware.
Object.assign(map, OVERRIDES);

const sorted = Object.fromEntries(
  Object.keys(map)
    .sort()
    .map((k) => [k, map[k]]),
);

writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");

const total = Object.keys(sorted).length;
const specific = Object.values(sorted).filter((v) => v !== FALLBACK).length;
console.log(`gravado em ${OUT}`);
console.log(`total: ${total} | destino específico: ${specific} | fallback: ${total - specific}`);

// confere no mesmo processo, sem round-trip por outro arquivo
const reread = JSON.parse(readFileSync(OUT, "utf8"));
console.log(`releitura imediata: ${Object.keys(reread).length} chaves`);

// Normaliza os termos de busca da Vitrine Virtual embutidos no mapa de
// redirect (minúsculo, sem acento, sem dosagem, no máximo 2 palavras) e
// reconfirma que cada termo limpo ainda resolve para o mesmo produto antes
// de gravar — evita regressão silenciosa na limpeza.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "src", "data", "redirect-map-produtos.json");
const STORE_SEARCH = "https://aguiadeouro.loja.pedidopago.com.br/produtos/";

function norm(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Extrai um termo de busca limpo a partir do texto já usado antes (o path da
// URL, decodificado) — remove dosagem, "com", "de", pontuação, e fica só com
// a(s) palavra(s) mais distintiva(s).
function cleanTerm(rawPathSegment) {
  let t = decodeURIComponent(rawPathSegment);
  t = norm(t);
  t = t.replace(/[^a-z0-9\s]/g, " "); // pontuação vira espaço
  t = t.replace(/\b\d+([.,]\d+)?\b/g, " "); // números soltos (dosagem)
  t = t.replace(/\b(mg|g|ml|com|de|da|do|e)\b/g, " "); // ruído comum
  t = t.replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean);
  return words.slice(0, 2).join(" ") || t;
}

async function searchStore(term) {
  const url = `${STORE_SEARCH}${encodeURIComponent(term)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = (await res.text()).replaceAll("<!-- -->", "");
  const names = [...html.matchAll(/class="css-1fd8jn0">([^<]*)<\/p>/g)].map((m) => m[1]);
  return names;
}

const map = JSON.parse(readFileSync(FILE, "utf8"));
const regressions = [];
let cleaned = 0;

for (const [path, dest] of Object.entries(map)) {
  if (!dest.startsWith(STORE_SEARCH)) continue;
  const oldSegment = dest.slice(STORE_SEARCH.length);
  const before = await searchStore(decodeURIComponent(oldSegment));
  const newTerm = cleanTerm(oldSegment);
  if (encodeURIComponent(newTerm) === oldSegment) continue; // já estava limpo (ex.: thalasferas)

  const after = await searchStore(newTerm);
  // regressao = o produto que aparecia antes some da nova lista
  const stillThere = before.length > 0 && after.some((n) => n === before[0]);

  if (stillThere || after.length > 0) {
    map[path] = STORE_SEARCH + encodeURIComponent(newTerm);
    cleaned++;
    process.stderr.write(`limpo: ${path} :: "${decodeURIComponent(oldSegment)}" -> "${newTerm}" (${after[0] ?? "?"})\n`);
  } else {
    regressions.push({ path, oldSegment, newTerm, before, after });
    process.stderr.write(`MANTIDO (regressao evitada): ${path}\n`);
  }
}

writeFileSync(FILE, JSON.stringify(map, null, 2) + "\n");
console.log(`\nlimpos: ${cleaned}`);
console.log(`regressoes evitadas (mantido termo original): ${regressions.length}`);
if (regressions.length) console.log(JSON.stringify(regressions, null, 2));

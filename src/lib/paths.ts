/**
 * Prefixo de pasta do deploy. Vazio na Vercel e em domínio próprio; no GitHub
 * Pages de um repositório de projeto (usuario.github.io/repo/) vira "/repo".
 * Definido em next.config.ts a partir de PAGES_BASE_PATH.
 *
 * Só precisa de `withBase` onde o Next NÃO prefixa sozinho: <a> comum, fetch,
 * e `src` de <Image> (com `images.unoptimized`, que o export estático exige).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}

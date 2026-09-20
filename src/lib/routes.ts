/**
 * Rotas que ainda dependem do WordPress atual (proxy via rewrites em
 * next.config.ts). O site novo está substituindo o WordPress inteiro — cada
 * caminho sai desta lista assim que a página equivalente é reconstruída
 * nativamente aqui.
 *
 * Já saíram: /quem-somos, /servicos, /contato, /politica-de-privacidade,
 * /termos-de-uso (reconstruídas). /necessidades, /produto, /produtos e
 * /topico não migram — o middleware de redirect (src/data/redirect-map-*)
 * cuida delas.
 *
 * Falta: /blog (78 posts, migração em andamento — enquanto não terminar,
 * `/blog/*` responde 404, já que WORDPRESS_ORIGIN está pausado no lado da
 * hospedagem).
 */
export const WORDPRESS_PATHS = ["blog"] as const;

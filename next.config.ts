import type { NextConfig } from "next";
import { WORDPRESS_PATHS } from "./src/lib/routes";
import redirectMapProdutos from "./src/data/redirect-map-produtos.json";

/** Domínio público onde a LP vai rodar. */
const SITE_HOST = "farmaciaaguiadeouro.com.br";

/**
 * Build para o GitHub Pages (`npm run build:pages`): export estático, sem
 * servidor. Na Vercel essa variável não existe e o site roda completo —
 * redirects, rewrites para o WordPress e as rotas /api.
 *
 * Num repositório de projeto o Pages serve em usuario.github.io/<repo>/, por
 * isso o prefixo (PAGES_BASE_PATH, ex.: "/meu-repo"). Com domínio próprio ou
 * repositório usuario.github.io, deixe vazio.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = (process.env.PAGES_BASE_PATH ?? "").replace(/\/$/, "");

/**
 * Origem do WordPress atual.
 *
 * Precisa ser o endereço DIRETO do servidor WordPress — não o domínio público.
 * Se apontar para farmaciaaguiadeouro.com.br, a LP passa a fazer proxy para si
 * mesma: cada acesso a /blog volta para o mesmo host, que reescreve de novo,
 * em laço, até a hospedagem cortar. É por isso que a checagem abaixo derruba o
 * build em vez de deixar passar.
 *
 * Formatos que servem, em ordem de preferência:
 *   https://wp.farmaciaaguiadeouro.com.br   (subdomínio novo apontando para o
 *                                            mesmo servidor de hoje)
 *   https://<host-de-origem-da-hospedagem>  (o "origin hostname" que a
 *                                            hospedagem fornece)
 *   http://<IP-do-servidor>                 (último recurso: quebra se o IP
 *                                            mudar e complica o certificado)
 */
const WORDPRESS_ORIGIN = process.env.WORDPRESS_ORIGIN?.replace(/\/$/, "") ?? "";

function originHost(value: string): string {
  try {
    return new URL(value).host.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

const isSelfReferencing =
  WORDPRESS_ORIGIN !== "" && originHost(WORDPRESS_ORIGIN) === SITE_HOST;

const LOOP_MESSAGE =
  `[aguia-de-ouro] WORDPRESS_ORIGIN aponta para ${SITE_HOST}, que é o próprio ` +
  `domínio da landing page. Isso faz o site reescrever para ele mesmo em laço.\n` +
  `Peça à hospedagem o endereço direto do servidor WordPress — um subdomínio ` +
  `como wp.${SITE_HOST}, o origin hostname da hospedagem, ou o IP.`;

if (isSelfReferencing) {
  if (process.env.NODE_ENV === "production") {
    // Falhar o build é melhor que publicar um laço de proxy.
    throw new Error(LOOP_MESSAGE);
  }
  console.warn(`\n${LOOP_MESSAGE}\nEm desenvolvimento, seguindo sem rewrites.\n`);
}

if (
  process.env.NODE_ENV === "production" &&
  !WORDPRESS_ORIGIN &&
  !isPages
) {
  console.warn(
    "\n[aguia-de-ouro] WORDPRESS_ORIGIN não definida: /blog vai retornar 404 " +
      "em produção até a migração dos posts terminar.\n",
  );
}

/**
 * /produto, /produtos e /necessidades: a farmácia descontinuou esse conteúdo
 * (virou catálogo da Vitrine Virtual). 86 URLs antigas — 57 com destino
 * específico (casado por nome contra a loja, ver docs/PROJETO.md), 29 em
 * fallback para /servicos. /topico entra à parte porque a API do WordPress não
 * expõe a lista de termos — qualquer URL ali cai direto no mesmo fallback.
 *
 * Por que `trailingSlash: true` no site inteiro: toda URL antiga do
 * WordPress termina em barra (`/produto/{slug}/`). Com o padrão do Next
 * (`trailingSlash: false`), o próprio framework tira a barra ANTES de
 * consultar `redirects()` — nem `redirects()` nem Middleware conseguem
 * evitar isso, é um passo interno que roda primeiro, incondicional. O
 * resultado seria sempre 2 saltos (Next tira a barra, só depois redireciona
 * pra loja), o que a auditoria de SEO original proíbe. Com
 * `trailingSlash: true`, a barra final vira a forma canônica do site inteiro
 * — a URL antiga já chega no formato certo e resolve em 1 salto direto.
 * Contrapartida: toda página nova (Quem Somos, Serviços, blog, etc.) também
 * canoniza com barra no fim — ver `alternates.canonical` em cada página e
 * `sitemap.ts`.
 */
const PRODUTOS_FALLBACK = "/servicos";
const produtosRedirects = Object.entries(
  redirectMapProdutos as Record<string, string>,
).map(([source, destination]) => ({
  source,
  destination,
  permanent: true,
}));

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Expõe o prefixo ao código de cliente (ver src/lib/paths.ts).
  env: { NEXT_PUBLIC_BASE_PATH: isPages ? pagesBasePath : "" },

  ...(isPages
    ? {
        // Redirects, rewrites e rotas /api precisam de servidor: não existem
        // no Pages. O otimizador de imagens também é de servidor.
        output: "export" as const,
        basePath: pagesBasePath,
        images: { unoptimized: true },
      }
    : {
        images: { formats: ["image/avif" as const, "image/webp" as const] },
        async redirects() {
          return [
            ...produtosRedirects,
            {
              source: "/topico/:path*",
              destination: PRODUTOS_FALLBACK,
              permanent: true,
            },
          ];
        },
        async rewrites() {
          if (!WORDPRESS_ORIGIN || isSelfReferencing) return [];
          return WORDPRESS_PATHS.flatMap((path) => [
            { source: `/${path}`, destination: `${WORDPRESS_ORIGIN}/${path}` },
            {
              source: `/${path}/:path*`,
              destination: `${WORDPRESS_ORIGIN}/${path}/:path*`,
            },
          ]);
        },
      }),
};

export default nextConfig;

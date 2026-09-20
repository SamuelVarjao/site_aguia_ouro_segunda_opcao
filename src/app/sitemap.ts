import type { MetadataRoute } from "next";
import { WORDPRESS_PATHS } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

// Exigido pelo export estático do GitHub Pages; na Vercel já era estático.
export const dynamic = "force-static";

/**
 * Páginas reconstruídas nativamente aqui — ficam no sitemap com prioridade
 * mais alta que o resto do que ainda mora no WordPress (WORDPRESS_PATHS).
 */
const NATIVE_PATHS = [
  { path: "quem-somos", priority: 0.8 },
  { path: "servicos", priority: 0.8 },
  { path: "contato", priority: 0.7 },
  { path: "politica-de-privacidade", priority: 0.3 },
  { path: "termos-de-uso", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...NATIVE_PATHS.map(({ path, priority }) => ({
      url: `${SITE_URL}/${path}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...WORDPRESS_PATHS.map((path) => ({
      url: `${SITE_URL}/${path}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

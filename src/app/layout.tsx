import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SiteInteractions from "@/components/SiteInteractions";
import {
  BUSINESS,
  FACEBOOK_URL,
  GOOGLE_REVIEWS,
  INSTAGRAM,
  SITE_URL,
  TIKTOK_URL,
} from "@/lib/site";
import "./globals.css";

const TITLE =
  "Farmácia de Manipulação em São Miguel Paulista | Águia de Ouro";
const DESCRIPTION =
  "Farmácia de manipulação em São Miguel Paulista desde 1988. Envie sua receita pelo WhatsApp e receba o orçamento. Fórmulas conferidas por farmacêutico responsável.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE_URL}/`,
    siteName: BUSINESS.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/**
 * Pharmacy, e não LocalBusiness genérico: o tipo específico é o que sustenta a
 * elegibilidade em resultados de saúde e em respostas geradas por IA.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Pharmacy",
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/opengraph-image.jpg`,
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  foundingDate: BUSINESS.foundingDate,
  sameAs: [INSTAGRAM.url, FACEBOOK_URL, TIKTOK_URL],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Marechal Tito, 677, 1º andar, sala 23",
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  employee: {
    "@type": "Person",
    name: BUSINESS.pharmacist.name,
    jobTitle: "Farmacêutica responsável",
    identifier: BUSINESS.pharmacist.crf,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: GOOGLE_REVIEWS.ratingValue,
    reviewCount: GOOGLE_REVIEWS.reviewCount,
    bestRating: GOOGLE_REVIEWS.bestRating,
  },
};

// [PENDENTE] ID de medição do fluxo de dados web (G-XXXXXXXXXX).
// O 329327830 informado é o ID da propriedade, que o GoogleAnalytics não aceita.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        {/* Liga as animações de revelação. Sem JavaScript a classe nunca é
            posta e nada fica escondido; se a hidratação falhar, o próprio
            script se desarma em 5s para não deixar conteúdo invisível. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "setTimeout(function(){if(!window.__hydrated)" +
              "document.documentElement.classList.remove('js')},5000);",
          }}
        />
        <Nav />
        {children}
        <Footer />
        <FloatingWhatsApp />
        <SiteInteractions />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}

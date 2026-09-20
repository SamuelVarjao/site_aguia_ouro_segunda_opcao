import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/Reveal";
import { BUSINESS, SITE_URL, WHATSAPP_LINKS } from "@/lib/site";

const TITLE = "Contato | Farmácia Águia de Ouro";
const DESCRIPTION =
  "Fale com a Farmácia Águia de Ouro: endereço, telefone, WhatsApp, horário de atendimento e formulário de contato.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contato/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/contato/` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Contato", item: `${SITE_URL}/contato/` },
  ],
};

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "Av. Marechal Tito, 677, São Miguel Paulista, São Paulo/SP",
  );

export default function ContatoPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Contato</p>
            <h1 className="t-h1 measure mt-5 text-navy-900">
              Fale com a gente.
            </h1>
            <p className="t-lead measure mt-6">
              Para orçamento de receita, o mais rápido é o WhatsApp. Para o
              resto, o formulário abaixo chega direto na nossa equipe.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="t-h2 measure">Envie uma mensagem</h2>
            <div className="mt-6 max-w-md">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="t-h2 measure">Outros canais</h2>
            <address className="t-body measure mt-6 text-navy-900/80 not-italic">
              Av. Marechal Tito, 677 — 1º andar, sala 23
              <br />
              {BUSINESS.district}, {BUSINESS.city}/{BUSINESS.region} — CEP{" "}
              {BUSINESS.postalCode}
              <br />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ga-event="link_institucional"
                data-ga-origem="contato-mapa"
                className="mt-2 inline-block underline-offset-4 hover:underline"
              >
                Ver no mapa
              </a>
            </address>

            <p className="t-body mt-6 text-navy-900/80">
              <span className="block">
                Telefone:{" "}
                <a
                  href={`tel:${BUSINESS.phoneE164}`}
                  data-ga-event="contato_telefone"
                  data-ga-origem="contato"
                  className="underline-offset-4 hover:underline"
                >
                  {BUSINESS.phone}
                </a>
              </span>
              <span className="block">
                E-mail:{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  data-ga-event="contato_email"
                  data-ga-origem="contato"
                  className="underline-offset-4 hover:underline"
                >
                  {BUSINESS.email}
                </a>
              </span>
            </p>

            <p className="t-body mt-6 text-navy-900/80">
              {BUSINESS.hours.weekdays}
              <br />
              {BUSINESS.hours.saturday}
            </p>

            <CtaLink
              href={WHATSAPP_LINKS.contato}
              event="contato_whatsapp"
              origem="contato"
              className="btn btn-gold mt-8"
            >
              Falar pelo WhatsApp
            </CtaLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

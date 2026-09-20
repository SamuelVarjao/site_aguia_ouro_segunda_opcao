import type { Metadata } from "next";
import { ClipboardCheck, Stethoscope, Truck } from "lucide-react";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/Reveal";
import { SITE_URL, WHATSAPP_LINKS } from "@/lib/site";

const TITLE = "Serviços | Farmácia Águia de Ouro";
const DESCRIPTION =
  "Manipulação dermatológica, hormonal, capilar, pediátrica, ortomolecular e para emagrecimento. Atendimento farmacêutico personalizado, entrega em São Paulo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/servicos/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/servicos/` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Serviços", item: `${SITE_URL}/servicos/` },
  ],
};

const ESPECIALIDADES = [
  {
    title: "Dermatológica",
    text: "Cremes, séruns e loções com a concentração de ativos que a sua pele e a sua receita pedem — nada de dose padrão de prateleira.",
  },
  {
    title: "Hormonal e ginecológica",
    text: "Reposição e fórmulas ginecológicas manipuladas conforme a prescrição, na forma farmacêutica indicada pelo médico.",
  },
  {
    title: "Emagrecimento",
    text: "Fórmulas para acompanhamento de emagrecimento, sempre sob prescrição — não vendemos nada dessa linha sem receita.",
  },
  {
    title: "Ortomolecular",
    text: "Suplementação personalizada, com as dosagens e combinações que a sua prescrição determina.",
  },
  {
    title: "Capilar",
    text: "Loções e tônicos para tratamento capilar manipulados sob medida, como o minoxidil em concentrações específicas.",
  },
  {
    title: "Pediátrica",
    text: "Formas farmacêuticas e sabores adequados para crianças, sempre a partir da receita do pediatra.",
  },
] as const;

export default function ServicosPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Serviços</p>
            <h1 className="t-h1 measure mt-5 text-navy-900">
              Cada fórmula, manipulada para uma pessoa só.
            </h1>
            <p className="t-lead measure mt-6">
              Trabalhamos com prescrição médica, em seis especialidades. Se a
              sua receita for de algo que não fazemos, avisamos antes de
              qualquer coisa — nunca depois.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="t-h2 measure">Especialidades de manipulação</h2>
          </Reveal>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {ESPECIALIDADES.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 80}>
                <h3 className="t-h3">{item.title}</h3>
                <p className="t-body mt-2 text-navy-900/80">{item.text}</p>
              </Reveal>
            ))}
          </ul>

          {/* Transparência deliberada: dizer o que não fazemos evita receita
              recusada só na hora da entrega — melhor saber antes. */}
          <Reveal>
            <p className="t-small measure mt-12 border-t border-border-subtle pt-6 text-navy-900/70">
              Não manipulamos fórmulas injetáveis, homeopáticas, veterinárias
              ou de baixo índice terapêutico. Se tiver dúvida se a sua receita
              se encaixa, mande uma foto pelo WhatsApp antes — confirmamos sem
              compromisso.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-050 py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-3 lg:gap-12">
          <Reveal>
            <Stethoscope
              aria-hidden="true"
              strokeWidth={1.25}
              className="size-8 text-navy-600"
            />
            <h3 className="t-h3 mt-4">Atendimento farmacêutico</h3>
            <p className="t-body mt-2 text-navy-900/80">
              Cada receita é conferida por uma farmacêutica antes de ir para o
              laboratório — dosagem, compatibilidade entre ativos, forma
              farmacêutica.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Truck
              aria-hidden="true"
              strokeWidth={1.25}
              className="size-8 text-navy-600"
            />
            <h3 className="t-h3 mt-4">Entrega em São Paulo</h3>
            <p className="t-body mt-2 text-navy-900/80">
              Entregamos na cidade de São Paulo. Você acompanha o preparo pela
              mesma conversa de WhatsApp da sua receita.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <ClipboardCheck
              aria-hidden="true"
              strokeWidth={1.25}
              className="size-8 text-navy-600"
            />
            <h3 className="t-h3 mt-4">Atendimento particular</h3>
            <p className="t-body mt-2 text-navy-900/80">
              Não atendemos convênio ou plano de saúde — o atendimento é
              particular, com orçamento informado antes de qualquer preparo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page flex flex-col items-start gap-6">
          <Reveal>
            <h2 className="t-h2 measure">Tem uma receita em mãos?</h2>
            <p className="t-lead measure mt-4">
              Mande uma foto pelo WhatsApp e receba o orçamento antes de
              qualquer coisa ir para o laboratório.
            </p>
            <CtaLink
              href={WHATSAPP_LINKS.servicos}
              event="contato_whatsapp"
              origem="servicos"
              className="btn btn-gold mt-8"
            >
              Enviar receita pelo WhatsApp
            </CtaLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

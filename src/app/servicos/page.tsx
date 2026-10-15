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
    text: "Cremes, séruns e loções com a concentração de ativos indicada na sua receita, em vez da dose padrão dos produtos de prateleira.",
  },
  {
    title: "Hormonal e ginecológica",
    text: "Reposição hormonal e fórmulas ginecológicas manipuladas conforme a prescrição, na forma farmacêutica que o médico indicar.",
  },
  {
    title: "Emagrecimento",
    text: "Fórmulas para tratamento de emagrecimento. Essa linha só é manipulada com receita.",
  },
  {
    title: "Ortomolecular",
    text: "Suplementos manipulados com as doses e combinações definidas na sua prescrição.",
  },
  {
    title: "Capilar",
    text: "Loções e tônicos capilares feitos sob medida, como o minoxidil na concentração que o médico receitou.",
  },
  {
    title: "Pediátrica",
    text: "Formas farmacêuticas e sabores adequados para crianças, sempre com receita do pediatra.",
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
              Manipulação sob prescrição, em seis especialidades.
            </h1>
            <p className="t-lead measure mt-6">
              Se a sua receita pedir algo que não fazemos, avisamos já no
              orçamento.
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
              ou de baixo índice terapêutico. Na dúvida, mande uma foto da
              receita pelo WhatsApp e a gente confirma, sem compromisso.
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
              Uma farmacêutica confere cada receita antes de ela seguir para o
              laboratório.
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
              Entregamos na cidade de São Paulo. O andamento do preparo você
              acompanha pela mesma conversa do WhatsApp em que mandou a
              receita.
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
              Não aceitamos convênio nem plano de saúde. O atendimento é
              particular, e você recebe o orçamento antes do preparo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page flex flex-col items-start gap-6">
          <Reveal>
            <h2 className="t-h2 measure">Tem uma receita em mãos?</h2>
            <p className="t-lead measure mt-4">
              Mande uma foto pelo WhatsApp e a gente passa o orçamento.
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

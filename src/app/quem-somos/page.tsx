import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import CtaLink from "@/components/CtaLink";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { BUSINESS, SITE_URL, WHATSAPP_LINKS } from "@/lib/site";

const TITLE = "Quem Somos | Farmácia Águia de Ouro";
const DESCRIPTION =
  "Farmácia de manipulação em São Miguel Paulista desde 1988. Conheça a história, a missão e a equipe por trás de cada fórmula.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/quem-somos/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/quem-somos/` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Quem somos", item: `${SITE_URL}/quem-somos/` },
  ],
};

const PILARES = [
  {
    title: "Missão",
    text: "Promover a saúde para que nossos clientes tenham qualidade de vida.",
  },
  {
    title: "Visão",
    text: "Buscar constante evolução tecnológica nos processos de manipulação, para atender às demandas do crescimento científico e tecnológico do nosso tempo.",
  },
  {
    title: "Política da qualidade",
    text: "Compromisso com medicamentos manipulados confiáveis, eficazes e seguros, do recebimento da matéria-prima até a entrega da fórmula pronta.",
  },
] as const;

const FARMACEUTICAS = [
  {
    name: "Dra. Midiã Varjão",
    role: "Farmacêutica responsável",
    crf: "CRF-SP 44084",
    formacao: [
      "Farmácia Clínica — Universidade Mogi das Cruzes — concluído em novembro de 2017",
      "Manipulação Magistral Alopática — Instituto Racine — concluído em novembro de 2010",
      "Farmácia Industrial — Universidade Brás Cubas (Mogi das Cruzes) — concluído em julho de 2007",
    ],
  },
  {
    name: "Dra. Juliana Araujo",
    role: "Farmacêutica",
    crf: "CRF-SP 48533",
    formacao: [
      "Graduação em Farmácia — 2009",
      "Pós-graduação em Farmacologia Clínica e Farmacoterapia — 2014",
      "Pós-graduação em Medicina Funcional Integrativa — 2026",
    ],
  },
] as const;

export default function QuemSomosPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Quem somos</p>
            <h1 className="t-h1 measure mt-5 text-navy-900">
              Uma farmácia de bairro que virou referência em manipulação.
            </h1>
            <p className="t-lead measure mt-6">
              Desde 1988 em São Miguel Paulista, sempre com o mesmo princípio:
              remédio bom é o que serve para uma pessoa só.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="left">
              <Photo
                src="/img/fundador-1988.jpg"
                alt="Antônio Cesar no laboratório da farmácia, nos primeiros anos"
                hint="Foto histórica — 16:9, sem filtro"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 448px, 92vw"
                className="mx-auto aspect-16/9 w-full max-w-md lg:max-w-none"
              />
            </Reveal>

            <Reveal delay={120}>
              <h2 className="t-h2 measure">Como começou</h2>
              <p className="t-body measure mt-5 text-navy-900/80">
                A Farmácia Águia de Ouro foi fundada em fevereiro de 1988, em
                São Miguel Paulista, por Antônio Cesar. Paranaense, ele
                começou a trabalhar em farmácia ainda na adolescência e veio
                para São Paulo já com experiência de balcão. Abriu a farmácia
                aos 29 anos, com um farmacêutico como único colaborador —
                cultivando o sonho de fazer do seu próprio jeito, com
                qualidade e autenticidade.
              </p>
              <p className="t-body measure mt-4 text-navy-900/80">
                Passados trinta e oito anos, a farmácia segue com o mesmo
                sonho: manipular com excelência. O bairro é o mesmo, e boa
                parte de quem chega hoje veio porque a mãe ou a avó já
                comprava aqui.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-navy-050 py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="t-h2 measure">Missão, visão e valores</h2>
          </Reveal>

          <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {PILARES.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 90}>
                <h3 className="t-h3">{item.title}</h3>
                <p className="t-body mt-2 text-navy-900/80">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="t-h2 measure">Nossas farmacêuticas</h2>
            <p className="t-lead measure mt-4">
              Cada fórmula passa pelas mãos e pela responsabilidade técnica
              de farmacêuticas registradas no CRF-SP.
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
            {FARMACEUTICAS.map((item, i) => (
              <Reveal
                as="li"
                key={item.name}
                delay={i * 90}
                className="rounded-card border border-border-subtle p-6 md:p-8"
              >
                <h3 className="t-h3">{item.name}</h3>
                <p className="t-small mt-1 text-navy-900/60">
                  {item.role} — {item.crf}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {item.formacao.map((linha) => (
                    <li key={linha} className="flex gap-3">
                      <GraduationCap
                        className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                        aria-hidden="true"
                      />
                      <span className="t-small text-navy-900/80">{linha}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-navy-050 py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="t-h2 measure">Equipe</h2>
            <p className="t-lead measure mt-4">
              Além das farmacêuticas, o balcão conta com uma equipe dedicada
              a receber cada receita com atenção.
            </p>
          </Reveal>

          {/* PENDENTE: fotos e bios da equipe, a caminho do cliente. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <Reveal key={n} delay={n * 80}>
                <Photo
                  src={null}
                  alt=""
                  hint="Área reservada para foto e bio de um integrante da equipe"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="aspect-4/5 w-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <h2 className="t-h2 measure">Regularidade e autorizações</h2>
            <p className="t-body measure mt-4 text-navy-900/80">
              {BUSINESS.licenses.ae}
              <br />
              {BUSINESS.licenses.afe}
              <br />
              {BUSINESS.licenses.crfCertificate}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-050 py-16 md:py-24">
        <div className="container-page flex flex-col items-start gap-6">
          <Reveal>
            <h2 className="t-h2 measure">Quer conhecer de perto?</h2>
            <p className="t-lead measure mt-4">
              Mande sua receita pelo WhatsApp e converse direto com a equipe
              do balcão.
            </p>
            <CtaLink
              href={WHATSAPP_LINKS.quemSomos}
              event="contato_whatsapp"
              origem="quem-somos"
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

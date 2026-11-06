import { ClipboardCheck, FileCheck2, Scale } from "lucide-react";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { withBase } from "@/lib/paths";

const POINTS = [
  {
    Icon: ClipboardCheck,
    title: "Conferência antes do preparo",
    text: "Antes de qualquer procedimento, são conferidas as doses, a compatibilidade dos ativos e a forma farmacêutica. Se houver alguma necessidade, conversamos com o prescritor para as devidas correções. Nem sempre o médico tem tudo na ponta da língua.",
  },
  {
    Icon: FileCheck2,
    title: "Matéria-prima com laudo",
    text: "Trabalhamos apenas com fornecedores qualificados, seguindo rigorosamente as normas da ANVISA. Cada lote chega com laudo de análise, e ativos com selo de autenticidade, como o Verisol, vêm lacrados e são conferidos no recebimento.",
  },
  {
    Icon: Scale,
    title: "Conferência depois do preparo",
    text: "A pesagem é feita em balança calibrada e registrada na ordem de manipulação. Após pesada e manipulada, a prescrição é conferida de novo: doses, forma farmacêutica, interações e incompatibilidades.",
  },
];

export default function Authority() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-page">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <h2 className="t-h2 measure">
                Onde sua fórmula é preparada
              </h2>

              <p className="t-lead measure mt-6">
                Toda receita passa duas vezes pela nossa farmacêutica
                responsável: antes de ir para o laboratório e depois que a
                fórmula fica pronta.
              </p>
            </Reveal>

            {/* Sem numeração: a sequência que o cliente executa é a do
                "Como enviar sua receita"; aqui são etapas internas. */}
            <ul className="mt-12 flex flex-col gap-8">
              {POINTS.map(({ Icon, title, text }, i) => (
                <Reveal
                  as="li"
                  key={title}
                  delay={i * 110}
                  className="flex gap-4"
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.25}
                    className="mt-1 size-7 shrink-0 text-navy-600"
                  />
                  <div>
                    <h3 className="t-h3">{title}</h3>
                    <p className="t-body measure mt-2 text-navy-900/80">
                      {text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <p className="t-closing mt-12 border-t border-border-subtle pt-8">
                Leva mais tempo, mas não pulamos nenhuma dessas etapas.
              </p>

              <a
                href={withBase("/quem-somos/")}
                data-ga-event="link_institucional"
                data-ga-origem="autoridade-saber-mais"
                className="btn btn-ghost-navy mt-8"
              >
                Conheça a farmácia
              </a>
            </Reveal>
          </div>

          {/* Fotos reais da farmácia. A grade segue o formato dos arquivos:
              todos horizontais, então a maior fica em cima e as duas menores
              embaixo — nada de forçar recorte vertical numa foto 4:3. */}
          <Reveal
            variant="scale"
            className="mx-auto grid w-full max-w-md gap-4 lg:max-w-none lg:gap-5"
          >
            <Photo
              src="/img/lab-manipulacao.jpg"
              alt="Farmacêutica preparando cápsulas na encapsuladora do laboratório"
              hint="Foto do laboratório — 3:2"
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 448px, 92vw"
              className="aspect-3/2"
            />
            <div className="grid grid-cols-2 gap-4 lg:gap-5">
              <Photo
                src="/img/lab-balanca.jpg"
                alt="Balança de precisão e gral de porcelana na bancada de pesagem"
                hint="Foto do laboratório — 4:3"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 216px, 45vw"
                className="aspect-4/3"
              />
              <Photo
                src="/img/lab-paramentacao.jpg"
                alt="Entrada da área de paramentação e do laboratório de antibióticos"
                hint="Foto do laboratório — 4:3"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 216px, 45vw"
                className="aspect-4/3"
                imgClassName="object-top"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

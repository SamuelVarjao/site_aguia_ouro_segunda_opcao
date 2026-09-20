import CtaLink from "./CtaLink";
import Reveal from "./Reveal";
import { WHATSAPP_LINKS, storeUrl } from "@/lib/site";

const STEPS = [
  {
    title: "Fotografe a receita",
    text: "Uma foto legível já resolve, não precisa de scanner. Se a prescrição tiver mais de uma página, envie todas.",
  },
  {
    title: "Envie pelo WhatsApp",
    text: "A conversa é direta com a equipe do balcão, de segunda a sábado, no horário da farmácia.",
  },
  {
    title: "Receba o orçamento",
    text: "Informamos o valor, o prazo de preparo e as formas de pagamento antes de qualquer coisa ir para o laboratório.",
  },
  {
    title: "Retire ou receba em casa",
    text: "Entregamos em São Paulo. Você acompanha o preparo pela mesma conversa.",
  },
];

/**
 * Única seção com numeração: aqui é de fato uma sequência que o cliente executa.
 */
export default function HowToOrder() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-page">
        <Reveal>
          <h2 className="t-h2 max-w-[20ch] md:mx-auto md:text-center">
            Como enviar sua receita
          </h2>
        </Reveal>

        <ol className="mt-12 md:mt-16 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 110}
              className="step relative pb-10 pl-16 last:pb-0 md:pb-0 md:pl-0"
            >
              {/* Linha vertical que conecta os números — só no mobile. */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-14 bottom-0 left-[23px] w-px bg-navy-050 md:hidden"
                />
              )}
              <span className="t-numeral absolute top-0 left-0 w-12 text-center md:static md:block md:w-auto md:text-left">
                {i + 1}
              </span>
              <h3 className="t-h3 md:mt-5">{step.title}</h3>
              <p className="t-body measure mt-2 text-navy-900/80">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 flex md:justify-center">
          <CtaLink
            href={WHATSAPP_LINKS.passos}
            event="contato_whatsapp"
            origem="como-pedir"
            className="btn btn-gold w-full sm:w-auto"
          >
            Enviar minha receita
          </CtaLink>
        </Reveal>

        {/* Bifurcação para o ecommerce: é o que desafoga o WhatsApp. */}
        <Reveal>
          <hr className="mt-16 h-px border-0 bg-gold-600" />

          <div className="mt-8 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <p className="t-lead measure">
              Não tem receita? Suplementos, vitaminas e dermocosméticos você
              compra direto na loja, sem precisar conversar com ninguém.
            </p>
            <CtaLink
              href={storeUrl("sem-receita")}
              event="ir_para_loja"
              origem="sem-receita"
              className="btn btn-ghost-navy w-full shrink-0 sm:w-auto"
            >
              Acessar Vitrine Virtual
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

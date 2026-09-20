import { Star } from "lucide-react";
import Reveal from "./Reveal";
import { GOOGLE_REVIEWS } from "@/lib/site";

/**
 * Avaliações reais do perfil da farmácia no Google Maps, conferidas
 * manualmente (nome abreviado para reduzir exposição de dado pessoal).
 * Atualizar de tempos em tempos — não há integração automática.
 */
const REVIEWS = [
  {
    name: "Cristiane F.",
    meta: "Local Guide · 16 avaliações",
    text: "Atendimento via WhatsApp nota 1000 com a Karina! Agilidade nas respostas e prontidão no preparo. Já é a segunda vez que peço e vou retirar — muito prático.",
  },
  {
    name: "Fernanda P.",
    meta: "10 avaliações",
    text: "Sempre fui muito bem atendida. Um dos melhores preços da região de São Miguel Paulista. Moro em Guarulhos e mesmo assim só compro com eles — peço tudo pelo WhatsApp e recebo em casa. Super indico.",
  },
  {
    name: "Jennifer A.",
    meta: "11 avaliações",
    text: "O atendimento é sempre atencioso e profissional, garantindo que cada necessidade seja atendida com cuidado e precisão. A qualidade dos produtos e a pontualidade na entrega fazem toda a diferença. Cliente fiel!",
  },
  {
    name: "Valderez R.",
    meta: "9 avaliações",
    text: "É uma excelente farmácia, tudo que preciso faço com eles. Me atendem muito bem pelo WhatsApp e só vou retirar. Para mim, a melhor. Sempre.",
  },
  {
    name: "Ana C.",
    meta: "6 avaliações",
    text: "Farmácia nota 10! Ótimo atendimento, produtos de qualidade, não tenho o que reclamar — do WhatsApp ao presencial, vocês estão de parabéns.",
  },
  {
    name: "Rita S.",
    meta: "5 avaliações",
    text: "Excelente farmácia, as atendentes são muito profissionais e atenciosas, em especial a Karina, sempre pronta para bem atender.",
  },
] as const;

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-gold-400 text-gold-600" />
      ))}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-navy-050 py-16 md:py-24">
      <div className="container-page">
        <Reveal className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="t-h2 measure">O que dizem os clientes</h2>
            <p className="t-lead measure mt-4">
              Avaliações reais, direto do perfil da farmácia no Google.
            </p>
          </div>

          <a
            href={GOOGLE_REVIEWS.url}
            target="_blank"
            rel="noopener noreferrer"
            data-ga-event="link_avaliacoes_google"
            data-ga-origem="home-avaliacoes"
            className="flex shrink-0 items-center gap-3 rounded-card border border-border-subtle bg-white px-5 py-3"
          >
            <span className="t-h3">
              {GOOGLE_REVIEWS.ratingValue.replace(".", ",")}
            </span>
            <span className="flex flex-col">
              <Stars />
              <span className="t-small text-navy-900/60">
                {GOOGLE_REVIEWS.reviewCount} avaliações no Google
              </span>
            </span>
          </a>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {REVIEWS.map((review, i) => (
            <Reveal
              as="li"
              key={review.name}
              delay={i * 80}
              className="flex h-full flex-col rounded-card bg-white p-6"
            >
              <Stars />
              <p className="t-body mt-4 grow text-navy-900/80">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
                <p className="t-small font-bold text-navy-900">{review.name}</p>
                <p className="t-small text-navy-900/60">{review.meta}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

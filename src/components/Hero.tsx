import Image from "next/image";
import CtaLink from "./CtaLink";
import { withBase } from "@/lib/paths";
import { WHATSAPP_LINKS, storeUrl } from "@/lib/site";

export default function Hero() {
  return (
    <section className="surface-dark relative isolate flex min-h-[640px] items-center overflow-hidden bg-navy-900 pt-[128px] pb-24 md:min-h-[82svh] md:pt-[168px] md:pb-28">
      {/* Poster: é ele, e não o vídeo, que pinta primeiro e responde pelo LCP. */}
      <Image
        src={withBase("/video/hero-poster.jpg")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_78%] md:object-center"
      />
      {/* Slot do vídeo. Fica vazio no HTML: o SiteInteractions só monta o
          <video> em telas grandes, sem movimento reduzido e depois que o
          poster já pintou. Abaixo de 768px o MP4/WebM nunca é baixado. */}
      <div id="hero-video" className="absolute inset-0 -z-20" />
      {/* Camada sólida — sem gradiente. Opacidade em --hero-overlay. */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: "rgb(4 6 62 / var(--hero-overlay))" }}
      />

      {/* O vídeo se dissolve no creme da próxima seção em vez de terminar
          numa linha dura. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-14 md:h-24"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-cream))",
        }}
      />

      <div className="container-page">
        <div className="max-w-[46rem]">
          {/* Eyebrow dentro do h1: a página tem um único h1 e ele precisa
              conter "farmácia de manipulação" — é por esse termo, somado ao
              local, que o site é posicionado hoje. Visualmente nada muda.
              Branco, e não dourado: com o filtro a 72% o dourado ficaria em
              2,8:1 sobre os frames claros do vídeo. */}
          <h1 className="t-h1 hero-enter text-white">
            <span className="eyebrow eyebrow-light block">
              Farmácia de manipulação
            </span>
            <span className="mt-5 block">
              Sua fórmula é preparada aqui, uma de cada vez.
            </span>
          </h1>

          <p
            className="t-lead measure hero-enter mt-6 text-white/90"
            style={{ animationDelay: "120ms" }}
          >
            Desde 1988, em São Miguel Paulista. Cada receita passa pela
            conferência de um farmacêutico antes de chegar ao laboratório.
          </p>

          <div
            className="hero-enter mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <CtaLink
              href={WHATSAPP_LINKS.hero}
              event="contato_whatsapp"
              origem="hero"
              className="btn btn-gold"
            >
              Enviar receita pelo WhatsApp
            </CtaLink>
            <CtaLink
              href={storeUrl("hero")}
              event="ir_para_loja"
              origem="hero"
              className="btn btn-ghost-light"
            >
              Acessar Vitrine Virtual
            </CtaLink>
          </div>

          <p
            className="t-small hero-enter mt-8 text-white/80"
            style={{ animationDelay: "340ms" }}
          >
            Av. Marechal Tito, 677 — São Miguel Paulista · Seg a sex, 8h30 às
            17h30 · Sáb, 9h às 13h
          </p>
        </div>
      </div>
    </section>
  );
}

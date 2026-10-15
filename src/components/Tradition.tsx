import Photo from "./Photo";
import Reveal from "./Reveal";
import { withBase } from "@/lib/paths";

export default function Tradition() {
  return (
    <section className="bg-navy-050 py-16 md:py-24">
      <div className="container-page">
        {/* items-start no desktop: com o parágrafo do fundador mais longo, a
            coluna de texto ficou bem mais alta que a foto — centralizada, ela
            flutuava num vão vazio dos dois lados. Alinhada ao topo, ancora
            junto do título e a folga sobra só embaixo, como um retrato ao
            lado de uma biografia. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Foto original, sem filtro. O arquivo é pequeno (870x461) — se a
              família tiver o negativo ou um scan maior, vale trocar. */}
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
            <h2 className="t-h2 measure">A mesma farmácia desde 1988</h2>

            <p className="t-lead measure mt-6">
              A Farmácia Águia de Ouro foi fundada em fevereiro de 1988, em São
              Miguel Paulista, por Antônio Cesar. Paranaense, ele trabalhava em
              farmácia desde a adolescência e chegou a São Paulo com experiência
              de balcão. Abriu a farmácia aos 29 anos, com um farmacêutico como
              único funcionário, porque queria trabalhar do jeito dele.
            </p>

            <p className="t-body measure mt-5 text-navy-900/80">
              Trinta e oito anos depois, continuamos no mesmo bairro. Muita
              gente que chega hoje conheceu a farmácia porque a mãe ou a avó já
              comprava aqui.
            </p>

            <a
              href={withBase("/quem-somos/")}
              data-ga-event="link_institucional"
              data-ga-origem="tradicao-historia"
              className="btn btn-ghost-navy mt-8"
            >
              Ler a história completa
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

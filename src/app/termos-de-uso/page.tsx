import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { withBase } from "@/lib/paths";
import { BUSINESS, SITE_URL, STORE_URL } from "@/lib/site";

const TITLE = "Termos de Uso | Farmácia Águia de Ouro";
const DESCRIPTION =
  "Condições de uso do site institucional da Farmácia Águia de Ouro.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/termos-de-uso/` },
  robots: { index: true, follow: true },
};

const ATUALIZADO_EM = "setembro de 2026";

export default function TermosDeUsoPage() {
  return (
    <main>
      <section className="bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Termos de uso</p>
            <h1 className="t-h1 measure mt-5 text-navy-900">Termos de Uso</h1>
            <p className="t-lead measure mt-6">
              Condições de uso deste site institucional —{" "}
              {SITE_URL.replace("https://", "")}, de {BUSINESS.legalName}.
              Última atualização: {ATUALIZADO_EM}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page measure flex flex-col gap-10 text-navy-900/85">
          <Reveal>
            <h2 className="t-h3">O que é este site</h2>
            <p className="t-body mt-3">
              Este é o site institucional da {BUSINESS.name} — farmácia de
              manipulação com CNPJ {BUSINESS.cnpj}. Aqui você encontra
              informações sobre nossos serviços, nossa história e nosso blog,
              e pode entrar em contato para enviar uma receita ou tirar uma
              dúvida. Este site não vende produtos nem processa pagamentos —
              para isso existe nossa loja on-line, em{" "}
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {STORE_URL.replace("https://", "")}
              </a>
              , com termos próprios.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">O conteúdo daqui não substitui prescrição</h2>
            <p className="t-body mt-3">
              As informações publicadas neste site — inclusive no blog — têm
              caráter educativo e não substituem consulta, diagnóstico ou
              prescrição de um profissional de saúde. Toda fórmula manipulada
              só é preparada mediante receita válida, conferida por
              farmacêutico responsável antes de ir para o laboratório.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Uso permitido</h2>
            <p className="t-body mt-3">
              Você pode navegar, ler e compartilhar o conteúdo deste site para
              uso pessoal e não comercial. Textos, imagens e a identidade
              visual pertencem à {BUSINESS.legalName} ou são usados com
              autorização — reprodução para fins comerciais depende de
              autorização prévia.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Formulário de contato</h2>
            <p className="t-body mt-3">
              Ao preencher o formulário de contato, você concorda em fornecer
              informações verdadeiras. Usamos os dados enviados apenas para
              responder ao seu contato — os detalhes de tratamento estão na
              nossa{" "}
              <a
                href={withBase("/politica-de-privacidade/")}
                className="underline-offset-4 hover:underline"
              >
                Política de Privacidade
              </a>
              .
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Links para outros sites</h2>
            <p className="t-body mt-3">
              Os links para WhatsApp, Instagram, Facebook, TikTok e para a
              nossa loja on-line levam a plataformas de terceiros, cada uma
              com seus próprios termos. Não somos responsáveis pelo conteúdo
              ou pelas práticas dessas plataformas.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Foro e legislação aplicável</h2>
            <p className="t-body mt-3">
              Este site é regido pela legislação brasileira. Qualquer
              controvérsia relacionada a ele será resolvida no foro da comarca
              de São Paulo/SP, salvo disposição legal em contrário.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Dúvidas</h2>
            <p className="t-body mt-3">
              Escreva para{" "}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="underline-offset-4 hover:underline"
              >
                {BUSINESS.email}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

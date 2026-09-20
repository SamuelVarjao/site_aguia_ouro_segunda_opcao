import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { BUSINESS, SITE_URL, STORE_URL } from "@/lib/site";

const TITLE = "Política de Privacidade | Farmácia Águia de Ouro";
const DESCRIPTION =
  "Como a Farmácia Águia de Ouro trata dados pessoais neste site: o que coletamos, por quê, e os direitos garantidos pela LGPD.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/politica-de-privacidade/` },
  robots: { index: true, follow: true },
};

const ATUALIZADO_EM = "setembro de 2026";

export default function PoliticaDePrivacidadePage() {
  return (
    <main>
      <section className="bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Política de privacidade</p>
            <h1 className="t-h1 measure mt-5 text-navy-900">
              Política de Privacidade
            </h1>
            <p className="t-lead measure mt-6">
              Este documento descreve o que este site — {BUSINESS.name},{" "}
              {SITE_URL.replace("https://", "")} — faz com os dados de quem o
              visita. Última atualização: {ATUALIZADO_EM}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-page measure flex flex-col gap-10 text-navy-900/85">
          <Reveal>
            <h2 className="t-h3">Quem é o responsável pelos dados</h2>
            <p className="t-body mt-3">
              {BUSINESS.legalName}, CNPJ {BUSINESS.cnpj}, com endereço em{" "}
              {BUSINESS.street}, {BUSINESS.district}, {BUSINESS.city}/
              {BUSINESS.region} — CEP {BUSINESS.postalCode}. Dúvidas ou
              solicitações sobre seus dados podem ser enviadas para{" "}
              <a
                href={`mailto:${BUSINESS.email}`}
                className="underline-offset-4 hover:underline"
              >
                {BUSINESS.email}
              </a>
              .
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">O que este site coleta</h2>
            <p className="t-body mt-3">
              Dois tipos de dado, e nenhum outro:
            </p>
            <ul className="t-body mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Dados de navegação</strong>, coletados automaticamente
                pelo Google Analytics (GA4): páginas visitadas, tempo de
                visita, origem do acesso e informações técnicas do
                dispositivo, por meio de cookies. Usamos isso só para entender
                quais páginas funcionam e quais precisam melhorar — não
                identificamos quem você é a partir desses dados.
              </li>
              <li>
                <strong>Dados que você preenche voluntariamente</strong> no
                formulário de contato — nome, e-mail, telefone e a mensagem
                que você escrever. Usamos isso exclusivamente para responder
                ao seu contato.
              </li>
              <li>
                <strong>Seu e-mail, se você se cadastrar na newsletter</strong>{" "}
                na página inicial. Usamos isso só para enviar o conteúdo que
                você pediu para receber, e você pode cancelar a qualquer
                momento pedindo pelo e-mail abaixo.
              </li>
            </ul>
            <p className="t-body mt-3">
              Este site não tem carrinho de compras, não processa pagamentos e
              não pede cadastro de conta — por isso não coletamos dados de
              cartão, CPF para compra ou endereço de entrega aqui.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Com quem compartilhamos</h2>
            <p className="t-body mt-3">
              Os dados de navegação passam pelo Google Analytics, sujeito à
              própria política de privacidade do Google. Os dados do
              formulário de contato chegam por e-mail à nossa equipe e não são
              repassados a terceiros. Não vendemos dado nenhum.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Links para o WhatsApp e para a loja</h2>
            <p className="t-body mt-3">
              Os botões de WhatsApp abrem uma conversa direta com a nossa
              equipe, sujeita aos termos do próprio WhatsApp. O botão
              &quot;Vitrine Virtual&quot; leva para{" "}
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {STORE_URL.replace("https://", "")}
              </a>
              , nossa loja on-line — uma plataforma separada, com cadastro,
              pagamento e sua própria política de privacidade. As regras deste
              documento valem só para o site institucional; ao comprar na
              loja, vale a política de lá.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Por quanto tempo guardamos</h2>
            <p className="t-body mt-3">
              As mensagens do formulário de contato ficam guardadas pelo tempo
              necessário para resolver o seu atendimento. O seu e-mail na
              newsletter fica guardado até você pedir o cancelamento. Os
              dados de navegação seguem o prazo padrão de retenção do Google
              Analytics.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="t-h3">Seus direitos, pela LGPD</h2>
            <p className="t-body mt-3">
              Você pode pedir a confirmação de que tratamos seus dados, o
              acesso a eles, a correção de dado incompleto ou desatualizado,
              a eliminação dos dados que nos enviou pelo formulário, ou
              informação sobre com quem compartilhamos. Basta escrever para{" "}
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

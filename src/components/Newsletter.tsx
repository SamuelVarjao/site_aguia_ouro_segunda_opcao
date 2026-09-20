"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useRef, useState } from "react";
import Reveal from "./Reveal";
import { withBase } from "@/lib/paths";
import { BUSINESS } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Segundo (e último) componente de cliente do site, ao lado do ContactForm —
 * mesma justificativa: precisa de estado real de formulário, então não cabe
 * na delegação do SiteInteractions.
 *
 * Mesmas duas defesas contra spam do ContactForm: honeypot e tempo mínimo
 * entre o formulário aparecer e ser enviado.
 */
export default function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const loadedAt = useRef(Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: data.get("email"),
      site: data.get("site"), // honeypot
      tempoDecorrido: Date.now() - loadedAt.current,
    };

    try {
      const res = await fetch(withBase("/api/newsletter/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Não foi possível cadastrar. Tente novamente.");
        return;
      }

      setStatus("success");
      form.reset();
      sendGAEvent("event", "newsletter_cadastro", { origem: "home-newsletter" });
    } catch {
      setStatus("error");
      setErrorMsg("Sem conexão no momento. Tente novamente em instantes.");
    }
  }

  return (
    <section className="bg-navy-900 py-16 text-white md:py-24">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <h2 className="t-h2 measure">
              Cuidados e novidades direto no seu e-mail
            </h2>
            <p className="t-lead measure mt-4 text-white/70">
              De vez em quando, mandamos dicas de saúde, cuidados com a pele e
              novidades da farmácia. Sem spam, e você cancela quando quiser.
            </p>
          </Reveal>

          <Reveal delay={90}>
            {status === "success" ? (
              <p
                role="status"
                className="t-body rounded-card border border-white/20 bg-white/10 p-6"
              >
                Cadastro feito! Em breve você recebe nosso primeiro e-mail.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    E-mail
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    placeholder="seu@email.com"
                    className="w-full rounded-button border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus-visible:border-gold-400"
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn btn-gold shrink-0 disabled:opacity-60"
                  >
                    {status === "sending" ? "Enviando..." : "Quero receber"}
                  </button>
                </div>

                {/* Honeypot — invisível pra quem usa mouse, teclado ou leitor
                    de tela; um robô que preenche todo campo do HTML cai aqui. */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
                  <label htmlFor="newsletter-site">Site</label>
                  <input
                    id="newsletter-site"
                    name="site"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="t-small text-red-300">
                    {errorMsg}
                  </p>
                )}

                <p className="t-small text-white/50">
                  Ao se cadastrar, você concorda em receber e-mails da{" "}
                  {BUSINESS.name}. Veja nossa{" "}
                  <a
                    href={withBase("/politica-de-privacidade/")}
                    className="underline-offset-4 hover:underline"
                  >
                    política de privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

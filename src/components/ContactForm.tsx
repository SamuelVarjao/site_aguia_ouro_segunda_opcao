"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useRef, useState } from "react";
import { withBase } from "@/lib/paths";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Único componente de cliente da página de Contato — precisa de estado
 * (campos, envio, sucesso/erro), então não cabe no padrão de delegação do
 * SiteInteractions.
 *
 * Duas defesas contra spam que não dependem de nenhum serviço de terceiro:
 * um campo honeypot (só um robô preenche "assunto", que fica fora da tela
 * pra gente) e o tempo entre o formulário carregar e ser enviado — menos de
 * 2,5s é comportamento de robô, não de alguém lendo e digitando.
 */
export default function ContactForm() {
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
      nome: data.get("nome"),
      email: data.get("email"),
      telefone: data.get("telefone"),
      mensagem: data.get("mensagem"),
      assunto: data.get("assunto"), // honeypot
      tempoDecorrido: Date.now() - loadedAt.current,
    };

    try {
      const res = await fetch(withBase("/api/contato/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Não foi possível enviar. Tente novamente.");
        return;
      }

      setStatus("success");
      form.reset();
      sendGAEvent("event", "contato_formulario", { origem: "contato" });
    } catch {
      setStatus("error");
      setErrorMsg("Sem conexão no momento. Tente novamente em instantes.");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="t-body rounded-card border border-border-subtle bg-navy-050 p-6 text-navy-900"
      >
        Mensagem enviada! A equipe responde no horário de atendimento.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="t-small font-bold text-navy-900">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          className="rounded-button border border-border-subtle px-4 py-3 text-navy-900 outline-none focus-visible:border-navy-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="t-small font-bold text-navy-900">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className="rounded-button border border-border-subtle px-4 py-3 text-navy-900 outline-none focus-visible:border-navy-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="telefone" className="t-small font-bold text-navy-900">
          Telefone <span className="font-normal text-navy-900/60">(opcional)</span>
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
          className="rounded-button border border-border-subtle px-4 py-3 text-navy-900 outline-none focus-visible:border-navy-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mensagem" className="t-small font-bold text-navy-900">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          maxLength={5000}
          rows={5}
          className="rounded-button border border-border-subtle px-4 py-3 text-navy-900 outline-none focus-visible:border-navy-600"
        />
      </div>

      {/* Honeypot — invisível pra quem usa mouse, teclado ou leitor de tela;
          um robô que preenche todo campo do HTML cai aqui. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
        <label htmlFor="assunto">Assunto</label>
        <input
          id="assunto"
          name="assunto"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="t-small text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-gold mt-2 disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}

import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const TO_EMAIL = "atendimentoaguiadeouro@gmail.com";
const FROM_EMAIL = "Site Águia de Ouro <formulario@farmaciaaguiadeouro.com.br>";

// Endpoint técnico: nunca deve aparecer indexado, nem responder a GET de
// navegador como se fosse uma página.
const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex" } as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  return NextResponse.json(
    { error: "Método não permitido." },
    { status: 405, headers: NOINDEX_HEADERS },
  );
}

export async function POST(request: Request) {
  // Mesma origem apenas: um POST vindo de outro site não tem motivo legítimo
  // de bater aqui.
  const origin = request.headers.get("origin");
  if (origin && origin !== SITE_URL) {
    return NextResponse.json(
      { error: "Origem não permitida." },
      { status: 403, headers: NOINDEX_HEADERS },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Não foi possível ler os dados enviados." },
      { status: 400, headers: NOINDEX_HEADERS },
    );
  }

  const nome = String(body.nome ?? "").trim();
  const email = String(body.email ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const mensagem = String(body.mensagem ?? "").trim();
  // Honeypot: campo que só um robô preenche. Se vier algo, finge sucesso —
  // não vale avisar o robô de que foi pego.
  const honeypot = String(body.assunto ?? "").trim();
  // Tempo entre o carregamento do formulário e o envio, em ms. Robôs
  // costumam submeter quase instantaneamente.
  const tempoDecorrido = Number(body.tempoDecorrido ?? 0);

  if (honeypot !== "" || tempoDecorrido < 2500) {
    return NextResponse.json({ ok: true }, { headers: NOINDEX_HEADERS });
  }

  if (!nome || nome.length > 120) {
    return NextResponse.json(
      { error: "Informe seu nome." },
      { status: 400, headers: NOINDEX_HEADERS },
    );
  }
  if (!isValidEmail(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Informe um e-mail válido." },
      { status: 400, headers: NOINDEX_HEADERS },
    );
  }
  if (telefone.length > 40) {
    return NextResponse.json(
      { error: "Telefone inválido." },
      { status: 400, headers: NOINDEX_HEADERS },
    );
  }
  if (!mensagem || mensagem.length > 5000) {
    return NextResponse.json(
      { error: "Escreva sua mensagem (até 5000 caracteres)." },
      { status: 400, headers: NOINDEX_HEADERS },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[contato] RESEND_API_KEY não configurada — e-mail não enviado.",
    );
    return NextResponse.json(
      { error: "Formulário indisponível no momento. Fale pelo WhatsApp." },
      { status: 500, headers: NOINDEX_HEADERS },
    );
  }

  const html = `
    <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Telefone:</strong> ${escapeHtml(telefone || "não informado")}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(mensagem).replace(/\n/g, "<br>")}</p>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `Contato pelo site — ${nome}`,
      html,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => "");
    console.error("[contato] falha ao enviar via Resend:", resendRes.status, detail);
    return NextResponse.json(
      { error: "Não foi possível enviar agora. Tente pelo WhatsApp." },
      { status: 502, headers: NOINDEX_HEADERS },
    );
  }

  return NextResponse.json({ ok: true }, { headers: NOINDEX_HEADERS });
}

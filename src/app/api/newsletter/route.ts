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

/**
 * Sem provedor de e-mail marketing por enquanto (Bloco B — "só capturar o
 * e-mail por enquanto"): cada cadastro vira um e-mail avulso pro
 * TO_EMAIL, reaproveitando a mesma conta Resend do formulário de contato.
 * Quando um ESP de verdade (Resend Audiences, Mailchimp etc.) entrar, é só
 * trocar o corpo desta função — o formulário e o contrato da API não mudam.
 */
export async function POST(request: Request) {
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

  const email = String(body.email ?? "").trim();
  // Honeypot: campo que só um robô preenche. Se vier algo, finge sucesso —
  // não vale avisar o robô de que foi pego.
  const honeypot = String(body.site ?? "").trim();
  const tempoDecorrido = Number(body.tempoDecorrido ?? 0);

  if (honeypot !== "" || tempoDecorrido < 1500) {
    return NextResponse.json({ ok: true }, { headers: NOINDEX_HEADERS });
  }

  if (!isValidEmail(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Informe um e-mail válido." },
      { status: 400, headers: NOINDEX_HEADERS },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[newsletter] RESEND_API_KEY não configurada — cadastro não enviado.",
    );
    return NextResponse.json(
      { error: "Cadastro indisponível no momento. Tente novamente mais tarde." },
      { status: 500, headers: NOINDEX_HEADERS },
    );
  }

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: "Novo cadastro na newsletter",
      html: `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>`,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => "");
    console.error(
      "[newsletter] falha ao enviar via Resend:",
      resendRes.status,
      detail,
    );
    return NextResponse.json(
      { error: "Não foi possível cadastrar agora. Tente novamente." },
      { status: 502, headers: NOINDEX_HEADERS },
    );
  }

  return NextResponse.json({ ok: true }, { headers: NOINDEX_HEADERS });
}
